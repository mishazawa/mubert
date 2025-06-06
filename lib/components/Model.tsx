import { useFrame } from "@react-three/fiber";
import CustomShaderMaterial from "three-custom-shader-material";

import { useMemo, useRef } from "react";

import type { RefObject } from "react";
import type { GenerativeShaderUniforms, ShaderControls } from "../types";

import {
  MESH_DETAIL,
  SPEED,
  SPEED_MULTIPLIER,
  UNIFORM_DEFAULTS,
} from "../constants";

import {
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  OctahedronGeometry,
} from "three";

import { compile } from "../shaders/compiler";

export function Model({ data }: { data: RefObject<ShaderControls> }) {
  const ref = useTransforms();
  const uniforms = useUniforms(data);

  const octahedron = useMemo(() => new OctahedronGeometry(1, MESH_DETAIL), []);
  const items = [octahedron];
  const visibleIndex = 0;

  const [vertexShader, fragmentShader] = useMemo(() => compile("noise"), []);

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

function useUniforms(
  controls: RefObject<ShaderControls>
): RefObject<GenerativeShaderUniforms> {
  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>(UNIFORM_DEFAULTS);

  // animate uniforms here
  useFrame(() => {
    uniforms.current.uTime.value += SPEED * SPEED_MULTIPLIER;
    uniforms.current.uSeed.value = controls.current.uSeed;
    uniforms.current.uColor1.value = controls.current.uColor1;
    uniforms.current.uColor2.value = controls.current.uColor2;
    uniforms.current.uUseColorKey.value = controls.current.uUseColorKey;
    uniforms.current.uColorKeyValue.value = controls.current.uColorKeyValue;
    uniforms.current.uColorNoiseScale.value = controls.current.uColorNoiseScale;
    uniforms.current.uDisplacementNoiseScale.value =
      controls.current.uDisplacementNoiseScale;
    uniforms.current.uDisplacementAmplitude.value =
      controls.current.uDisplacementAmplitude;
    uniforms.current.uRoughness.value = controls.current.uRoughness;
    uniforms.current.uClearcoat.value = controls.current.uClearcoat;
    uniforms.current.uClearcoatRoughness.value =
      controls.current.uClearcoatRoughness;
    uniforms.current.uIridescence.value = controls.current.uIridescence;
  });

  return uniforms;
}
