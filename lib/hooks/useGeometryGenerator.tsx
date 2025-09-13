import { useMemo } from "react";
import { BufferGeometry, IcosahedronGeometry, EdgesGeometry } from "three";

import { useParameters } from "./useParameters";

export function useSolidGeo(resolution: number): BufferGeometry {
  const icosahedron = useMemo(
    () => new IcosahedronGeometry(1, resolution * 2),
    [resolution]
  );

  return icosahedron;
}

export function useWireframeGeo(): BufferGeometry[] {
  const { geoWireframeScale: scale, geoWireframeDetail: resolution } =
    useParameters();

  const icosahedron = useMemo(
    () => new EdgesGeometry(new IcosahedronGeometry(scale, resolution), 0.1),
    [scale, resolution]
  );

  return [icosahedron];
}
