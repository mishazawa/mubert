import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  Mesh,
  PerspectiveCamera,
  PointsMaterial,
  Scene,
  Vector3,
} from "three";
import { useParameters } from "../../hooks/useParameters";
import { GPUComputationRenderer } from "three/examples/jsm/Addons.js";

import CustomShaderMaterial from "three-custom-shader-material";

import particles from "../../shaders/meta/particles.glsl?raw";

import { compile } from "../../shaders/compiler";

import vertex from "./_vert.glsl?raw";
import fragment from "./_frag.glsl?raw";

import { useSharedUniforms } from "../../hooks/useSharedUniforms";
import { useSharedTextures } from "../../hooks/useSharedTextures";
import { useFBO } from "@react-three/drei";

import {
  PARTICLES_CAMERA_ZOOM,
  PARTICLES_COUNT,
  PARTICLES_SIZE_RENDER_PASS,
  PARTICLES_TEXTURE_SIZE,
} from "../../constants";
import { useDebug } from "../../hooks/useDebug";

export function Particles() {
  const { uRefractionTex } = useSharedTextures();

  const sharedUniforms = useSharedUniforms();

  const { uniforms } = useParticlesSimulation();
  const geo = useParticlesGeometry();

  const renderScene = useMemo(() => new Scene(), []);
  const renderTarget = useFBO(PARTICLES_TEXTURE_SIZE, PARTICLES_TEXTURE_SIZE);

  uRefractionTex.current = renderTarget.texture as DataTexture;
  uRefractionTex.current.needsUpdate = true;

  (sharedUniforms.current.uRefractionTex.value as any) = uRefractionTex.current;
  (sharedUniforms.current.uParticlesRes.value as any) = [
    PARTICLES_TEXTURE_SIZE,
    PARTICLES_TEXTURE_SIZE,
  ];
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
    const cam: PerspectiveCamera = mainCamera.clone() as PerspectiveCamera;
    cam.zoom = PARTICLES_CAMERA_ZOOM;
    cam.aspect = 1;
    cam.updateProjectionMatrix();
    return cam;
  }, [mainCamera]);

  const ctx = useParameters();
  uniforms.current.uColor1a.value = ctv(ctx.palette[4]);
  uniforms.current.uColor2a.value = ctv(ctx.palette[2]);

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
  const pointSize = useDebug("pointSize", PARTICLES_SIZE_RENDER_PASS);

  return (
    <group position={[0, 0, 0]}>
      <group>
        <points ref={originalRef} geometry={geo}>
          <CustomShaderMaterial
            uniforms={uniforms.current}
            baseMaterial={PointsMaterial}
            vertexShader={vertex}
            fragmentShader={fragment}
            transparent
            toneMapped={false}
            sizeAttenuation={true}
            size={pointSize}
          />
        </points>
      </group>
      {/* <mesh scale={[2, 2, 1]} position={[0, -2, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={uRefractionTex.current} toneMapped={false} />
      </mesh> */}
    </group>
  );
}

// function DebugParticles({
//   positions,
//   sim,
// }: {
//   sim: GPUComputationRenderer;
//   positions: Variable;
// }) {
//   const mat = useRef<MeshBasicMaterial>(null!);

//   useEffect(() => {
//     mat.current.map = sim.getCurrentRenderTarget(positions).texture;
//     mat.current.map.needsUpdate = true;
//   }, [positions]);

//   return (
//     <mesh scale={[2, 2, 1]} position={[0, 0, 0]}>
//       <planeGeometry args={[1, 1]} />
//       <meshBasicMaterial ref={mat} toneMapped={false} />
//     </mesh>
//   );
// }

function ctv(arg0: number[]): Vector3 {
  return new Vector3(...arg0);
}

function useParticlesSimulation() {
  const ctx = useParameters();
  const { gl } = useThree();

  const localUniforms = useRef({
    uPositionsTex: { value: undefined },
    uColor1a: { value: ctv(ctx.palette[0]) },
    uColor2a: { value: ctv(ctx.palette[4]) },
  });
  console.log(ctx.palette[0]);

  // create uniforms for particles CSM
  const uniforms = useSharedUniforms();

  (uniforms.current.uSimulationRes.value as any) = [
    PARTICLES_COUNT,
    PARTICLES_COUNT,
  ];
  // create simulator
  const [sim, positions, _velocities] = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(
      PARTICLES_COUNT,
      PARTICLES_COUNT,
      gl
    );

    const pos0 = gpuCompute.createTexture();
    const vel0 = gpuCompute.createTexture();

    const COMMON_DEFINES = {
      PI: "3.14159265358979323846",
    };

    const simulationShader = compile({
      shaderType: "texture",
      preset: "slai",
      presetStyle: "point",
      defines: COMMON_DEFINES,
    });

    const particlesShader = compile({
      shaderType: "texture",
      preset: "slai",
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
  }, [gl, ctx.data.uSeed]);

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
  return useMemo(() => {
    const resolution = PARTICLES_COUNT;
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
  }, []);
}
