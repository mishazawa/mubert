import { POINT_DETAIL_DIVIDER } from "../constants";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import {
  BufferGeometry,
  CapsuleGeometry,
  EdgesGeometry,
  IcosahedronGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  PlaneGeometry,
  type Mesh,
  type Object3D,
  Quaternion,
  Box3,
  Vector3,
} from "three";

import type { MaterialType } from "../shaders/types";

import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { useParameters } from "../hooks/useParameters";

const BYPASS_NORMALS = false;

const _q = new Quaternion();
const _bbox = new Box3();
const _size = new Vector3();
const _axis = new Vector3();

export function useGeometry(
  resolution: number
): Record<MaterialType, BufferGeometry[]> {
  const icosahedron = useMemo(
    () => new IcosahedronGeometry(1, resolution),
    [resolution]
  );
  const icosahedron2 = useMemo(
    () => new IcosahedronGeometry(1, 15),
    [resolution]
  );
  const sphere = useMemo(
    () =>
      new SphereGeometry(
        1,
        resolution / POINT_DETAIL_DIVIDER,
        resolution / POINT_DETAIL_DIVIDER
      ),
    [resolution]
  );
  const pill = useMemo(
    () => new CapsuleGeometry(1, 1, 16, 32, 8),
    [resolution]
  );

  const torusknot = useMemo(
    () => new TorusKnotGeometry(1, 0.25, resolution * 2, resolution / 2),
    []
  );
  const torus = useMemo(
    () => new TorusGeometry(1, 0.25, resolution, resolution),
    []
  );
  const plane = useMemo(
    () => new PlaneGeometry(10, 10, resolution, resolution),
    []
  );
  const torusw = useMemo(
    () => recomputeNormals(new EdgesGeometry(torus, 0.2)),
    [torus, resolution]
  );
  const torusknotw = useMemo(
    () => recomputeNormals(new EdgesGeometry(torusknot, 10.85)),
    [torusknot, resolution]
  );

  return {
    solid: [icosahedron, torus, torusknot, pill, plane],
    point: [icosahedron2, sphere, pill],
    wireframe: [torusw, torusknotw],
  };
}

export function useTransforms(): RefObject<Object3D> {
  const ref = useRef<Mesh>(null!);
  const ctx = useParameters();

  // animate mesh here
  useFrame(() => {
    const fft_val = ctx.fft.current.val;
    const rot_speed = ctx.rot_speed.current;
    const t = ctx.fft.current.time;

    _axis
      .set(Math.sin(t * 2.0), Math.sin(t * 3.0), Math.sin(t * 5.0))
      .normalize(); // Y-axis

    _q.setFromAxisAngle(_axis, fft_val * rot_speed);
    _bbox.setFromObject(ref.current).getSize(_size);

    if (_size.z > 0.1) {
      ref.current.quaternion.multiply(_q);
    }
  });

  return ref;
}

function recomputeNormals(g: BufferGeometry) {
  if (BYPASS_NORMALS) return g;
  const a = mergeVertices(g);
  a.computeVertexNormals();
  return a;
}
