import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import { Box3, Quaternion, Vector3, type Object3D } from "three";
import { useParameters } from "./useParameters";
import { useDebug } from "./useDebug";
import { useSharedUniforms } from "./useSharedUniforms";

const _q = new Quaternion();
const _bbox = new Box3();
const _size = new Vector3();

export function useTransformsReactive<
  T extends Object3D
>(): RefObject<Object3D> {
  const ref = useRef<T>(null!);
  const ctx = useParameters();
  const uniforms = useSharedUniforms();
  const stopObject = useDebug("stopObject", false);

  useFrame(() => {
    if (stopObject) return;

    const fft_val = uniforms.current.uRMS.value;
    const rot_speed = ctx.rot_speed.current * 0.5;

    const axis = uniforms.current.uRotationAxis.value as Vector3;

    _q.setFromAxisAngle(axis, fft_val * rot_speed);

    _bbox.setFromObject(ref.current);
    _bbox.getSize(_size);

    if (_size.z > 0.1) {
      ref.current.quaternion.multiply(_q);
    }
  });

  return ref;
}
