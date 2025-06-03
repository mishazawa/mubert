import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import {
  CapsuleGeometry,
  Color,
  Mesh,
  Object3D,
  OctahedronGeometry,
  SphereGeometry,
  TorusGeometry,
} from "three";

import { GenerativeShaderMaterial } from "./generativeShader";
import type { GenerativeShaderUniforms } from "./generativeShader";

const SPEED = 10; // suppose to be bpm?
const SPEED_MULTIPLIER = 0.001;

export function Model() {
  const ref = useTransforms();
  const uniforms = useUniforms();

  const octahedron = useMemo(() => new OctahedronGeometry(1, 64), []);
  const capsule = useMemo(() => new CapsuleGeometry(1, 1, 4, 8), []);
  const sphere = useMemo(() => new SphereGeometry(1, 32, 16), []);
  const torus = useMemo(() => new TorusGeometry(1, 1, 16, 100), []);

  const items = [octahedron, capsule, sphere, torus];

  const visibleIndex = Math.floor(Math.random() * items.length);

  return (
    <group ref={ref}>
      {items.map((i, idx) => (
        <mesh geometry={i} visible={idx === visibleIndex}>
          {/* @ts-ignore */}
          <generativeShaderMaterial
            key={GenerativeShaderMaterial.key}
            uniforms={uniforms.current}
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
    color: { value: new Color(1, 0, 0) },
    time: { value: 0 },
  });

  // animate uniforms here
  useFrame(() => {
    uniforms.current.time.value += SPEED * SPEED_MULTIPLIER;
  });

  return uniforms;
}
