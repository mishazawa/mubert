import { useFrame } from "@react-three/fiber";
import { Matrix4, Quaternion, Vector3 } from "three";
import { useParameters } from "./useParameters";
import { useDebug } from "./useDebug";

import { useRef, type RefObject } from "react";
import type { GenerativeShaderUniforms } from "../shaders/types";

const _tempq = new Quaternion().identity();
const _axisq = new Quaternion();
const _axis = new Vector3();

export function useUniformObjectMatrix(
  uniforms: RefObject<GenerativeShaderUniforms>
) {
  const mat = useRef<Matrix4>(new Matrix4().identity());
  const ctx = useParameters();
  const stopObject = useDebug("stopObject", false);

  useFrame(() => {
    if (stopObject) return;

    const fft_val = uniforms.current.uRMS.value;
    const rot_speed = ctx.rot_speed.current;

    _axis
      .set(
        Math.sin(uniforms.current.uTime.value * 0.2),
        Math.cos(uniforms.current.uTime.value * 0.4),
        Math.sin(uniforms.current.uTime.value * 0.5)
      )
      .normalize();

    _axisq.setFromAxisAngle(_axis, fft_val * rot_speed);

    _tempq.multiply(_axisq).normalize(); // <-- normalization added here

    mat.current.makeRotationFromQuaternion(_tempq);
    uniforms.current.uObjectMatrix.value = mat.current;
  });
}
