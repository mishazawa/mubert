import { useThree, useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { DataTexture } from "three";
import { useParameters } from "../../hooks/useParameters";
import { GPUComputationRenderer } from "three/examples/jsm/Addons.js";

import fragmentShaderVel from "./shaders/velocity.glsl?raw";
import fragmentShaderPos from "./shaders/position.glsl?raw";

type ParticlesProps = {
  resolution: number;
};

export function Particles({ resolution }: ParticlesProps) {
  const ctx = useParameters();
  const { gl } = useThree();

  const [sim, positionTexture] = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(resolution, resolution, gl);

    const pos0 = gpuCompute.createTexture();
    const vel0 = gpuCompute.createTexture();

    const velVar = gpuCompute.addVariable(
      "textureVelocity",
      fragmentShaderVel,
      vel0
    );
    const posVar = gpuCompute.addVariable(
      "texturePosition",
      fragmentShaderPos,
      pos0
    );

    gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
    gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);

    velVar.material.uniforms.time = { value: 0.0 };

    const error = gpuCompute.init();
    if (error !== null) {
      throw error;
    }

    return [gpuCompute, posVar];
  }, [resolution, gl]);

  useFrame(() => {
    sim.compute();
    ctx.ref_texture.current = sim.getCurrentRenderTarget(positionTexture)
      .texture as DataTexture;
  });

  return null;
}
