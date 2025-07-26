import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import {
  BufferGeometry,
  EdgesGeometry,
  IcosahedronGeometry,
  SphereGeometry,
  type Mesh,
  type Object3D,
  Quaternion,
  Box3,
  Vector3,
} from "three";

import type { MaterialType } from "../shaders/types";

import { useParameters } from "../hooks/useParameters";

const _q = new Quaternion();
const _bbox = new Box3();
const _size = new Vector3();
const _axis = new Vector3();

export function useGeometry(
  resolution: number
): Record<MaterialType, BufferGeometry> {
  const icosahedron = useMemo(
    () => new IcosahedronGeometry(1, resolution),
    [resolution]
  );
  const icosahedronw = useMemo(
    () =>
      new EdgesGeometry(
        new SphereGeometry(1, resolution * 2, resolution * 2),
        0.1
      ),
    [icosahedron]
  );
  return {
    solid: icosahedron,
    point: icosahedron,
    wireframe: icosahedronw,
  };
}

export function useTransforms(): RefObject<Object3D> {
  const ref = useRef<Mesh>(null!);
  const ctx = useParameters();

  useFrame(() => {
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
