import { useFrame } from "@react-three/fiber";
import CustomShaderMaterial from "three-custom-shader-material";

import { useMemo, useRef } from "react";

import type { RefObject } from "react";
import type { GenerativeShaderUniforms } from "../types";

import { MESH_DETAIL, SPEED, SPEED_MULTIPLIER } from "../constants";

import {
  Color,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  OctahedronGeometry,
} from "three";

import { compile } from "../shaders/compiler";

export function Model() {
  const ref = useTransforms();
  const uniforms = useUniforms();

  const octahedron = useMemo(() => new OctahedronGeometry(1, MESH_DETAIL), []);

  const items = [octahedron];

  const visibleIndex = 0;

  const [vertexShader, fragmentShader] = compile("organic");

  return (
    <group ref={ref}>
      {items.map((i, idx) => (
        <mesh key={idx} geometry={i} visible={idx === visibleIndex}>
          <CustomShaderMaterial
            baseMaterial={MeshPhysicalMaterial}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms.current}
            roughness={0}
            iridescence={1}
            iridescenceIOR={2.3}
            clearcoat={1}
            clearcoatRoughness={0}
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
    // uColor1: { value: new Color(0xffbe0b) },
    // uColor2: { value: new Color(0xff006e) },
    uColor1: { value: new Color(0xffffff) },
    uColor2: { value: new Color(0xff006e) },
    uTime: { value: 0 },
  });

  // animate uniforms here
  useFrame(() => {
    uniforms.current.uTime.value += SPEED * SPEED_MULTIPLIER;
  });

  return uniforms;
}
