import { PARTICLES_COUNT } from "../../../constants";
import { useParameters } from "../../../hooks/useParameters";
import { useSharedUniforms } from "../../../hooks/useSharedUniforms";
import { compile } from "../../../shaders/compiler";
import { ctv } from "../../../utils";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import type { DataTexture } from "three";
import { GPUComputationRenderer } from "three/examples/jsm/Addons.js";
import particles from "../../../shaders/meta/particles.glsl?raw";

export function useParticlesSimulation() {
  const ctx = useParameters();
  const { gl } = useThree();

  const localUniforms = useRef({
    uPositionsTex: { value: undefined },
    uColor1a: { value: ctv(ctx.palette[0]) },
    uColor2a: { value: ctv(ctx.palette[4]) },
  });

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

  localUniforms.current.uColor1a.value = ctv(ctx.palette[4]);
  localUniforms.current.uColor2a.value = ctv(ctx.palette[2]);

  useFrame(() => {
    sim.compute();
  });

  return { localUniforms };
}
