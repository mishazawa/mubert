"use client";
import { useFrame } from "@react-three/fiber";
import { RefObject, useRef } from "react";
import { Color, Mesh, Object3D } from "three";
import { GenerativeShaderMaterial } from "./generativeShader";
import { useAudioData } from "./hooks";
import {
  AnalysisData,
  ApiProps,
  CanvasProps,
  GenerativeShaderUniforms,
} from "./types";

export function Model({ audio, bpm }: CanvasProps & ApiProps) {
  const data = useAudioData(audio, { bpm });
  const ref = useTransforms(data);
  const uniforms = useUniforms(data);

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

function useTransforms(_: RefObject<AnalysisData>): RefObject<Object3D> {
  const ref = useRef<Mesh>(null!);

  // animate mesh here
  useFrame(() => {
    ref.current.rotation.x += 0.001;
    ref.current.rotation.y += 0.001;
  });

  return ref;
}

function useUniforms(
  data: RefObject<AnalysisData>
): RefObject<GenerativeShaderUniforms> {
  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>({
    color: { value: new Color(1, 0, 0) },
    time: { value: 0 },
  });

  // animate uniforms here
  useFrame(() => {
    uniforms.current.time.value = data.current.playtime;
  });

  return uniforms;
}
