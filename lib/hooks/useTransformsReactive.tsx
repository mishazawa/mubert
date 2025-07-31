import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import { Box3, Quaternion, Vector3, type Object3D } from "three";
import { useParameters } from "./useParameters";
import { useDebug } from "./useDebug";

const _q = new Quaternion();
const _bbox = new Box3();
const _size = new Vector3();
const _axis = new Vector3();

export function useTransformsReactive<
  T extends Object3D
>(): RefObject<Object3D> {
  const ref = useRef<T>(null!);
  const ctx = useParameters();
  const stopObject = useDebug("stopObject", false);

  useFrame(() => {
    if (stopObject) return;

    const fft_val = ctx.fft.current.val;
    const rot_speed = ctx.rot_speed.current * 0.5;
    const t = ctx.fft.current.time;

    _axis
      .set(Math.sin(t * 0.2), Math.sin(t * 0.4), Math.sin(t * 0.2))
      .normalize();
    _q.setFromAxisAngle(_axis, fft_val * rot_speed);

    _bbox.setFromObject(ref.current);
    _bbox.getSize(_size);

    if (_size.z > 0.1) {
      ref.current.quaternion.multiply(_q);
    }
  });

  return ref;
}
