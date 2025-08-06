import { useParameters } from "../../../hooks/useParameters";
import {
  useSharedMatrix,
  useSharedUniforms,
} from "../../../hooks/useSharedUniforms";
import { ctv } from "../../../utils";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DataTexture, Vector3 } from "three";
import { useSharedTextures } from "../../../hooks/useSharedTextures";

// consume texture and pass it to the shader + some small uniforms
// purpose: move the simulation to a singleton and use the result in components

export function useParticlesSimulation() {
  const ctx = useParameters();

  const { uSimulationTex } = useSharedTextures();
  const [matrix] = useSharedMatrix();
  const localUniforms = useRef({
    uPositionsTex: { value: new DataTexture() },
    uColor1a: { value: ctv(ctx.palette[0]) },
    uColor2a: { value: ctv(ctx.palette[4]) },
    uTime: { value: 0 },
    uRMS: { value: 0 },
    uRotationAxis: { value: new Vector3() },
    uObjectMatrix: { value: matrix },
  });

  useEffect(() => {
    localUniforms.current.uPositionsTex.value = uSimulationTex.current;
    localUniforms.current.uPositionsTex.value.needsUpdate = true;
  });

  localUniforms.current.uColor1a.value = ctv(ctx.palette[4]);
  localUniforms.current.uColor2a.value = ctv(ctx.palette[2]);

  const uniforms = useSharedUniforms();

  useFrame(() => {
    localUniforms.current.uTime.value = uniforms.current.uTime.value;
    localUniforms.current.uRMS.value = uniforms.current.uRMS.value;
    localUniforms.current.uObjectMatrix.value = matrix;
  });

  return localUniforms;
}
