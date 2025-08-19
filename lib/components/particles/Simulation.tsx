import { createContext, useMemo, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import type { DataTexture } from "three";

import { useSharedUniforms } from "../../hooks/useSharedUniforms";
import { useParameters } from "../../hooks/useParameters";
import { PARTICLES_COUNT } from "../../constants";
import { compile } from "../../shaders/compiler";
import particles from "../../shaders/meta/particles.glsl?raw";
import { useSharedTextures } from "../../hooks/useSharedTextures";
import { useDebug } from "../../hooks/useDebug";

const Context = createContext<null>(null!);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const ctx = useParameters();

  // create uniforms for particles CSM
  const uniforms = useSharedUniforms();

  const particlesRes: [number, number] = useDebug("particlesTexture", [
    PARTICLES_COUNT,
    PARTICLES_COUNT,
  ]);

  (uniforms.current.uSimulationRes.value as any) = particlesRes;

  const gl = useThree((s) => s.gl);

  // create simulator
  const [sim, positions, _velocities] = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(...particlesRes, gl);

    const pos0 = gpuCompute.createTexture();
    const vel0 = gpuCompute.createTexture();

    const COMMON_DEFINES = {
      PI: "3.14159265358979323846",
      PARTICLES_SIM_W: `${parseInt(particlesRes[0].toString(), 10)}`,
      PARTICLES_SIM_H: `${parseInt(particlesRes[1].toString(), 10)}`,
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

    const COMPUTE_VERT = `precision highp float;
      varying vec2 vUv;
      varying vec3 vWorldPosition;  // dummy
      varying vec3 vWorldNormal;    // dummy
      varying vec3 vPositionD;    // dummy
      varying vec3 vNormalD;    // dummy

      void main() {
        vUv = uv;
        vWorldPosition = vec3(0.0); // compute pass doesn't have world-space
        gl_Position = vec4(position, 1.0);
      }`;
    velVar.material.vertexShader = COMPUTE_VERT;
    posVar.material.vertexShader = COMPUTE_VERT;

    gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
    gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);

    const error = gpuCompute.init();
    if (error !== null) {
      throw error;
    }

    return [gpuCompute, posVar, velVar];
  }, [gl, ctx.data.uSeed, particlesRes]);

  const { uSimulationTex } = useSharedTextures();

  // update textures
  const tex = sim.getCurrentRenderTarget(positions).texture as DataTexture;
  uSimulationTex.current = tex;
  uSimulationTex.current.needsUpdate = true;

  useFrame(() => {
    sim.compute();
  });

  return <Context.Provider value={null}>{children}</Context.Provider>;
};
