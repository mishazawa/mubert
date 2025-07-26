import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  Mesh,
  MeshBasicMaterial,
  PointsMaterial,
  Scene,
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
import { useSharedTextures } from "../../hooks/useSharedTextures";
import { useFBO } from "@react-three/drei";
import {
  PARTICLES_CAMERA_ZOOM,
  PARTICLES_SIZE_RENDER_PASS,
} from "../../constants";

export function Particles() {
  const ctx = useParameters();
  const { uRefractionTex } = useSharedTextures();

  const sharedUniforms = useSharedUniforms();

  const { uniforms, ...rest } = useParticlesSimulation();
  const geo = useParticlesGeometry();

  const renderScene = useMemo(() => new Scene(), []);
  const renderTarget = useFBO();

  uRefractionTex.current = renderTarget.texture as DataTexture;
  uRefractionTex.current.needsUpdate = true;

  (sharedUniforms.current.uRefractionTex.value as any) = uRefractionTex.current;

  const originalRef = useRef<Mesh>(null!);
  const cloneRef = useRef<Mesh>(null!);

  useEffect(() => {
    if (!originalRef.current) return;

    const clone = originalRef.current.clone();

    clone.material = (originalRef.current.material as PointsMaterial).clone();

    if ("size" in clone.material)
      clone.material.size = PARTICLES_SIZE_RENDER_PASS;
    clone.material.needsUpdate = true;

    renderScene.add(clone);
    cloneRef.current = clone;

    return () => {
      renderScene.remove(clone);
    };
  }, []);

  const gl = useThree((state) => state.gl);
  const mainCamera = useThree((state) => state.camera);

  const renderCamera = useMemo(() => {
    const cam = mainCamera.clone();
    cam.zoom = PARTICLES_CAMERA_ZOOM;
    cam.updateProjectionMatrix();
    return cam;
  }, [mainCamera]);

  useFrame(() => {
    if (!cloneRef.current) return;

    // camera
    renderCamera.matrix.copy(mainCamera.matrix);
    renderCamera.matrix.decompose(
      renderCamera.position,
      renderCamera.quaternion,
      renderCamera.scale
    );

    // particles
    cloneRef.current.matrix.copy(originalRef.current.matrix);
    cloneRef.current.matrix.decompose(
      cloneRef.current.position,
      cloneRef.current.quaternion,
      cloneRef.current.scale
    );

    // render to fbo and swap back
    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(renderScene, renderCamera);
    gl.setRenderTarget(null);
  });

  return (
    <group>
      <DebugParticles {...rest} />
      <points
        ref={originalRef}
        geometry={geo}
        visible={ctx.debug.vertex === false}
      >
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
  positions,
}: {
  sim: GPUComputationRenderer;
  positions: Variable;
}) {
  const ctx = useParameters();
  const mat = useRef<MeshBasicMaterial>(null!);
  const { uRefractionTex } = useSharedTextures();

  useEffect(() => {
    mat.current.map = uRefractionTex.current;
    mat.current.map.needsUpdate = true;
  }, [positions]);

  return (
    <mesh scale={[2, 2, 1]} position={[0, 0, 0]} visible={ctx.debug.vertex}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={mat}
        map={uRefractionTex.current}
        toneMapped={false}
      />
    </mesh>
  );
}

function useParticlesSimulation() {
  const ctx = useParameters();
  const { gl } = useThree();

  const localUniforms = useRef({ uPositionsTex: { value: undefined } });

  // create uniforms for particles CSM
  const uniforms = useSharedUniforms();
  const { uRefractionTex } = useSharedTextures();
  // create simulator
  const [sim, positions, _velocities] = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(
      ctx.debug.particlesCount,
      ctx.debug.particlesCount,
      gl
    );

    const pos0 = gpuCompute.createTexture();
    const vel0 = gpuCompute.createTexture();

    const COMMON_DEFINES = {
      PI: "3.14159265358979323846",
      REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width ?? 1}`,
    };

    const simulationShader = compile({
      shaderType: "texture",
      preset: ctx.debug.preset,
      presetStyle: "point",
      defines: COMMON_DEFINES,
    });

    const particlesShader = compile({
      shaderType: "texture",
      preset: ctx.debug.preset,
      presetStyle: "point",
      defines: COMMON_DEFINES,
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

  (localUniforms.current.uPositionsTex.value as unknown) =
    sim.getCurrentRenderTarget(positions).texture;
  (
    localUniforms.current.uPositionsTex.value as unknown as DataTexture
  ).needsUpdate = true;

  useFrame(() => {
    sim.compute();
  });

  return { uniforms: localUniforms, sim, positions };
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
