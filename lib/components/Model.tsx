import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { RefObject } from "react";
import { Color, Mesh, Object3D } from "three";
import { GenerativeShaderMaterial } from "./generativeShader";
import type { GenerativeShaderUniforms } from "./generativeShader";

const SPEED = 10; // suppose to be bpm?
const SPEED_MULTIPLIER = 0.001;

export function Model() {
  const ref = useTransforms();
  const uniforms = useUniforms();

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1, 64]} />
      {/* <torusKnotGeometry args={[1, 0.3, 256, 64]} /> */}
      {/* @ts-ignore */}
      <generativeShaderMaterial
        key={GenerativeShaderMaterial.key}
        uniforms={uniforms.current}
      />
    </mesh>
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
