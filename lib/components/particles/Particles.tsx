import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  MeshBasicMaterial,
  PointsMaterial,
} from "three";
import { useParameters } from "../../hooks/useParameters";
import {
  GPUComputationRenderer,
  type Variable,
} from "three/examples/jsm/Addons.js";

import CustomShaderMaterial from "three-custom-shader-material";

import particles from "../../shaders/meta/particles.glsl?raw";

import { compile } from "../../shaders/compiler";

import vertex from "./shaders/dummyv.glsl?raw";
import fragment from "./shaders/dummyf.glsl?raw";
import { useSharedUniforms } from "../../hooks/useSharedUniforms";

export function Particles() {
  const ctx = useParameters();

  const { uniforms, ...rest } = useParticlesSimulation();
  const geo = useParticlesGeometry();

  return (
    <group>
      <DebugParticles {...rest} />
      <points geometry={geo} visible={ctx.debug.vertex === false}>
        <CustomShaderMaterial
          uniforms={uniforms.current}
          baseMaterial={PointsMaterial}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          toneMapped={false}
          sizeAttenuation={true}
          size={ctx.debug.pointSize}
        />
      </points>
    </group>
  );
}

function DebugParticles({
  sim,
  positions,
}: {
  sim: GPUComputationRenderer;
  positions: Variable;
}) {
  const ctx = useParameters();

  const mat = useRef<MeshBasicMaterial>(null!);
  useEffect(() => {
    mat.current.map = sim.getCurrentRenderTarget(positions).texture;
    mat.current.map.needsUpdate = true;
  }, [positions]);
  return (
    <mesh scale={[2, 2, 1]} position={[0, 0, 0]} visible={ctx.debug.vertex}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={mat} toneMapped={false} />
    </mesh>
  );
}

function useParticlesSimulation() {
  const ctx = useParameters();
  const { gl } = useThree();

  // create uniforms for particles CSM
  const uniforms = useSharedUniforms();

  // create simulator
  const [sim, positions, velocities] = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(
      ctx.debug.particlesCount,
      ctx.debug.particlesCount,
      gl
    );

    const pos0 = gpuCompute.createTexture();
    const vel0 = gpuCompute.createTexture();

    const simulationShader = compile({
      shaderType: "texture",
      preset: ctx.debug.preset,
      presetStyle: "point",
      defines: {
        PI: "3.14159265358979323846",
      },
    });

    const particlesShader = compile({
      shaderType: "texture",
      preset: ctx.debug.preset,
      presetStyle: "point",
      defines: {
        PI: "3.14159265358979323846",
      },
      overrideBody: particles,
    });

    const velVar = gpuCompute.addVariable(
      "uTextureSimulation1",
      simulationShader,
      vel0
    );

    const posVar = gpuCompute.addVariable(
      "texturePosition",
      particlesShader,
      pos0
    );

    posVar.material.uniforms = uniforms.current;
    velVar.material.uniforms = uniforms.current;

    gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
    gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);

    const error = gpuCompute.init();
    if (error !== null) {
      throw error;
    }

    return [gpuCompute, posVar, velVar];
  }, [gl, ctx.data.uSeed, ctx.debug.particlesCount]);

  useEffect(() => {
    uniforms.current.uRefTex.value = sim.getCurrentRenderTarget(positions)
      .texture as DataTexture;
    uniforms.current.uRefTex.value.needsUpdate = true;
  }, [positions, velocities]);

  useFrame(() => {
    sim.compute();
  });

  return { uniforms, sim, positions };
}

function useParticlesGeometry() {
  const ctx = useParameters();

  return useMemo(() => {
    const resolution = ctx.debug.particlesCount;
    let pg = new BufferGeometry();
    let pos = new Float32Array(resolution * resolution * 3);
    let uv = new Float32Array(resolution * resolution * 2);
    for (let i = 0; i < resolution * resolution; i++) {
      let x = i % resolution; // column
      let y = Math.floor(i / resolution); // row
      x = Math.random() * 10000.0;
      y = Math.random() * 10000.0;
      pos.set([x, y, 0], i * 3);
      const u = x / (resolution - 1);
      const v = y / (resolution - 1);
      uv.set([u, v], i * 2);
    }
    pg.setAttribute("position", new BufferAttribute(pos, 3));
    pg.setAttribute("uv", new BufferAttribute(uv, 2));

    return pg;
  }, [ctx.debug.particlesCount]);
}
