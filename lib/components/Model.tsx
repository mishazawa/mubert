import { useFrame } from "@react-three/fiber";
import CustomShaderMaterial from "three-custom-shader-material";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";

import {
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  OctahedronGeometry,
} from "three";

type UniformValue<T> = {
  value: T;
};

// declare uniforms here
export type GenerativeShaderUniforms = {
  time: UniformValue<number>;
  color1: UniformValue<Color>;
  color2: UniformValue<Color>;
};

import vertexShader from "../shaders/vertex_noise.glsl?raw";
import fragmentShader from "../shaders/fragment_noise.glsl?raw";
import perlin from "../shaders/utils/noise3.glsl?raw";

const SPEED = 10; // suppose to be bpm?
const SPEED_MULTIPLIER = 0.001;
const INCLUDE_MAP = {
  "//#include<pnoise>": perlin,
};

export function Model() {
  const ref = useTransforms();
  const uniforms = useUniforms();

  const octahedron = useMemo(() => new OctahedronGeometry(1, 128), []);
  const icosahedron = useMemo(() => new IcosahedronGeometry(1, 128), []);

  const items = [octahedron, icosahedron];

  const visibleIndex = 0;

  return (
    <group ref={ref}>
      {items.map((i, idx) => (
        <mesh key={idx} geometry={i} visible={idx === visibleIndex}>
          <CustomShaderMaterial
            baseMaterial={MeshPhysicalMaterial}
            vertexShader={compileShader(vertexShader, INCLUDE_MAP)}
            fragmentShader={compileShader(fragmentShader, INCLUDE_MAP)}
            uniforms={uniforms.current}
            roughness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function useTransforms(): RefObject<Object3D> {
  const ref = useRef<Mesh>(null!);

  // animate mesh here
  useFrame(() => {
    ref.current.rotation.x += 0.001;
    ref.current.rotation.y += 0.001;
  });

  return ref;
}

function useUniforms(): RefObject<GenerativeShaderUniforms> {
  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>({
    color1: { value: new Color(0xffbe0b) },
    color2: { value: new Color(0xff006e) },
    time: { value: 0 },
  });

  // animate uniforms here
  useFrame(() => {
    uniforms.current.time.value += SPEED * SPEED_MULTIPLIER;
  });

  return uniforms;
}

function compileShader(raw: string, map: Record<string, string>) {
  let copy = `${raw}`;

  Object.entries(map).forEach(([key, value]) => {
    copy = copy.replace(key, value);
  });
  return copy;
}
