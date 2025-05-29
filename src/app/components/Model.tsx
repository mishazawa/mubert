"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import { ColorShiftMaterial } from "./generativeShader";

export function Model() {
  const ref = useRef<Mesh>(null!);

  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry />
      {/* @ts-ignore */}
      <colorShiftMaterial
        key={ColorShiftMaterial.key}
        color="hotpink"
        time={1}
      />
    </mesh>
  );
}
