import { SPEED, SPEED_MULTIPLIER, UNIFORM_DEFAULTS } from "../constants";
import type { CanvasProps } from "../types";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  IcosahedronGeometry,
  OctahedronGeometry,
  SphereGeometry,
  TorusKnotGeometry,
  type Mesh,
  type Object3D,
} from "three";
import { HorizontalLinesGeometry } from "./HorizontalLinesGeometry";
import type {
  GenerativeShaderUniforms,
  ShaderControls,
  UniformValue,
} from "../shaders/types";

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

  const edges = useMemo(
    () =>
      new HorizontalLinesGeometry(
        new TorusKnotGeometry(1, 0.25, 300, 32),
        //new SphereGeometry(1, resolution, resolution),
        "x"
      ),
    [resolution]
  );

  return [octahedron, sphere, icosahedron, edges];
}

export function useUniforms(
  controls: ShaderControls,
  speedControls: number,
  analyser: Pick<CanvasProps, "getFFT" | "getRMS">
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
    const [rms] = analyser.getRMS();

    uniforms.current.uRMS.value = rms;
    uniforms.current.uFFT.value = analyser.getFFT();

    (uniforms.current.uTime as UniformValue<number>).value +=
      SPEED_MULTIPLIER * speedControls * rms;
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
