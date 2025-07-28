import { useMemo } from "react";
import {
  BufferGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  TetrahedronGeometry,
  SphereGeometry,
} from "three";

import type { MaterialType } from "../shaders/types";

export function useSolidGeo(
  resolution: number
): Record<MaterialType, BufferGeometry> {
  const icosahedron = useMemo(
    () => new IcosahedronGeometry(1, resolution),
    [resolution]
  );
  const icosahedronw = useMemo(
    () => new TetrahedronGeometry(1.5, 1),
    [resolution]
  );
  return {
    solid: icosahedron,
    point: icosahedron,
    wireframe: icosahedronw,
  };
}

export function useWireframeGeo(
  resolution: number,
  scale: number
): BufferGeometry[] {
  const o2 = useMemo(
    () => new SphereGeometry(scale, resolution + 8, resolution * 2 + 8),
    [scale, resolution]
  );
  const o3 = useMemo(
    () => new OctahedronGeometry(scale, resolution),
    [scale, resolution]
  );
  const o4 = useMemo(
    () => new IcosahedronGeometry(scale, resolution),
    [scale, resolution]
  );
  return [o2, o3, o4];
}
