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

const Context = createContext<null>(null!);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const ctx = useParameters();

  // create uniforms for particles CSM
  const uniforms = useSharedUniforms();

  (uniforms.current.uSimulationRes.value as any) = [
    PARTICLES_COUNT,
    PARTICLES_COUNT,
  ];

  const gl = useThree((s) => s.gl);

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
