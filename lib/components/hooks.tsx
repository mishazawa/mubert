import { SPEED, SPEED_MULTIPLIER, UNIFORM_DEFAULTS } from "@lib/constants";
import type { GenerativeShaderUniforms, ShaderControls } from "@lib/types";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  IcosahedronGeometry,
  OctahedronGeometry,
  SphereGeometry,
  type Mesh,
  type Object3D,
} from "three";

type ElementType = keyof ShaderControls;

export function useGeometry(resolution: number) {
  const sphere = useMemo(
    () => new SphereGeometry(1, resolution, resolution),
    [resolution]
  );
  const octahedron = useMemo(
    () => new OctahedronGeometry(1, resolution),
    [resolution]
  );
  const icosahedron = useMemo(
    () => new IcosahedronGeometry(1, resolution),
    [resolution]
  );

  return [octahedron, sphere, icosahedron];
}

export function useUniforms(
  controls: ShaderControls,
  speedControls: number
): RefObject<GenerativeShaderUniforms> {
  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>(UNIFORM_DEFAULTS);
  useEffect(() => {
    Object.keys(controls).map((k) => {
      const key = k as ElementType;
      uniforms.current[key].value = controls[key];
    });
  }, [controls]);
  // animate uniforms here
  useFrame(() => {
    uniforms.current.uTime.value += SPEED * SPEED_MULTIPLIER * speedControls;
  });

  return uniforms;
}

export function useTransforms(): RefObject<Object3D> {
  const ref = useRef<Mesh>(null!);

  // animate mesh here
  useFrame(() => {
    ref.current.rotation.x += 0.001;
    ref.current.rotation.y += 0.001;
  });

  return ref;
}
