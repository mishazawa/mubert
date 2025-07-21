import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  MeshBasicMaterial,
  PointsMaterial,
  Vector3,
} from "three";
import { useParameters } from "../../hooks/useParameters";
import {
  GPUComputationRenderer,
  type Variable,
} from "three/examples/jsm/Addons.js";

import CustomShaderMaterial from "three-custom-shader-material";

import particles from "../../shaders/meta/particles.glsl?raw";

import { compile } from "../../shaders/compiler";
import { assignUniforms } from "../../shaders/uniforms";
import type { ShaderControls } from "../../shaders/types";
import { useUniforms } from "../hooks";

import vertex from "./shaders/dummyv.glsl?raw";
import fragment from "./shaders/dummyf.glsl?raw";

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
  const uniforms = useUniforms();

  // create simulator
  const [sim, positions] = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(
      ctx.debug.particlesCount,
      ctx.debug.particlesCount,
      gl
    );

    const pos0 = gpuCompute.createTexture();
    const vel0 = gpuCompute.createTexture();

    // fill initial velocities
    const data = vel0.image.data as Float32Array;

    let v = new Vector3();
    for (let k = 0, kl = data.length; k < kl; k += 4) {
      v.setFromCylindricalCoords(
        Math.random(),
        Math.PI * 2 * Math.random(),
        Math.random() - 0.5
      );
      data[k + 0] = v.y * 1.0;
      data[k + 1] = v.x * 1.0;
      data[k + 2] = v.z * 1.0;
      data[k + 3] = Math.random() * 0.1 + 0.9;
    }

    vel0.needsUpdate = true;

    const simulationShader = compile({
      shaderType: "texture",
      preset: ctx.debug.preset,
      presetStyle: "point",
      defines: {
        PI: "3.14",
      },
    });

    const velVar = gpuCompute.addVariable(
      "uTextureSimulation1",
      simulationShader,
      vel0
    );
    const posVar = gpuCompute.addVariable("texturePosition", particles, pos0);

    gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
    gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);

    // generate and fill uniforms for simulation
    velVar.material.uniforms = uniforms.current;
    assignUniforms(
      velVar.material.uniforms as Record<keyof ShaderControls, any>,
      ctx.data
    );

    const error = gpuCompute.init();
    if (error !== null) {
      throw error;
    }

    return [gpuCompute, posVar, velVar];
  }, [gl, ctx.data, ctx.debug.particlesCount]);

  useEffect(() => {
    uniforms.current.uRefTex.value = sim.getCurrentRenderTarget(positions)
      .texture as DataTexture;
    uniforms.current.uRefTex.value.needsUpdate = true;
  }, [positions]);

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
      const x = i % resolution; // column
      const y = Math.floor(i / resolution); // row
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
