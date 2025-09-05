import { useParameters } from "../../../hooks/useParameters";
import { useSharedUniforms } from "../../../hooks/useSharedUniforms";
import { ctv } from "../../../utils";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DataTexture, Matrix4, Vector3 } from "three";
import { useSharedTextures } from "../../../hooks/useSharedTextures";

// consume texture and pass it to the shader + some small uniforms
// purpose: move the simulation to a singleton and use the result in components

export function useParticlesSimulation() {
  const ctx = useParameters();
  const ps = ctx.random.float(0, 1);
  const ps2 = ctx.random.float(0, 1);


  const { uSimulationTex } = useSharedTextures();

  const localUniforms = useRef({
    uPositionsTex: { value: new DataTexture() },
    uColor1a: { value: ctv(ctx.palette[0]) },
    uColor2a: { value: ctv(ctx.palette[1]) },
    uColor3a: { value: ctv(ctx.palette[2]) },
    uColor4a: { value: ctv(ctx.palette[3]) },
    uColor5a: { value: ctv(ctx.palette[4]) },
    uTime: { value: 0 },
    uRMS: { value: 0 },
    uPsize: { value: ps },
    uPsize2: { value: ps2 },
    uRotationAxis: { value: new Vector3() },
    uObjectMatrix: { value: new Matrix4().identity() },
  });

  useEffect(() => {
    localUniforms.current.uPositionsTex.value = uSimulationTex.current;
    localUniforms.current.uPositionsTex.value.needsUpdate = true;
  });

  localUniforms.current.uColor1a.value = ctv(ctx.palette[0]);
  localUniforms.current.uColor2a.value = ctv(ctx.palette[1]);
  localUniforms.current.uColor3a.value = ctv(ctx.palette[2]);
  localUniforms.current.uColor4a.value = ctv(ctx.palette[3]);
  localUniforms.current.uColor5a.value = ctv(ctx.palette[4]);
  localUniforms.current.uPsize.value = ps;
  localUniforms.current.uPsize2.value = ps2;

  const uniforms = useSharedUniforms();

  useFrame(() => {
    localUniforms.current.uTime.value = uniforms.current.uTime.value;
    localUniforms.current.uRMS.value = uniforms.current.uRMS.value;
    localUniforms.current.uObjectMatrix.value =
      uniforms.current.uObjectMatrix.value;
  });

  return localUniforms;
}
