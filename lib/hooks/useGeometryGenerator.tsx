import { useMemo } from "react";
import {
  BufferGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  TetrahedronGeometry,
  SphereGeometry,
  EdgesGeometry,
} from "three";

import type { MaterialType } from "../shaders/types";
import { useParameters } from "./useParameters";

export function useSolidGeo(
  resolution: number
): Record<MaterialType, BufferGeometry> {
  // const icosahedron = useMemo(
  //   () => new IcosahedronGeometry(1, resolution),
  //   [resolution]
  // );
  const icosahedron = useMemo(
    () => new SphereGeometry(1, 8*resolution, 4*resolution),
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

export function useWireframeGeo(): BufferGeometry[] {
  const { geoWireframeScale: scale, geoWireframeDetail: resolution } =
    useParameters();

  const o2 = useMemo(
    () =>
      new EdgesGeometry(
        new SphereGeometry(scale, resolution * 8, resolution * 8),
        0.1
      ),
    [scale, resolution]
  );
  const o3 = useMemo(
    () => new EdgesGeometry(new OctahedronGeometry(scale, resolution), 0.1),
    [scale, resolution]
  );
  const o4 = useMemo(
    () => new EdgesGeometry(new IcosahedronGeometry(scale, resolution), 0.1),
    [scale, resolution]
  );
  return [o2, o3, o4];
}
