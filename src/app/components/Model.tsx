"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useRef } from "react";
import { Color, Mesh, Object3D } from "three";
import {
  GenerativeShaderMaterial,
  GenerativeShaderUniforms,
} from "./generativeShader";

export function Model() {
  const ref = useTransforms();
  const uniforms = useUniforms();

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1, 40]} />
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
  const { clock } = useThree();

  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>({
    color: { value: new Color(1, 0, 0) },
    time: { value: 0 },
  });

  // animate uniforms here
  useFrame(() => {
    uniforms.current.time.value = clock.getElapsedTime();
  });

  return uniforms;
}
