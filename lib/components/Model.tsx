import { useFrame } from "@react-three/fiber";
import CustomShaderMaterial from "three-custom-shader-material";

import { useCallback, useMemo, useRef } from "react";

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

export function Model({ data }: { data: ShaderControls }) {
  const ref = useTransforms();
  const uniforms = useUniforms(data);

  const octahedron = useMemo(() => new OctahedronGeometry(1, MESH_DETAIL), []);
  const items = [octahedron];
  const visibleIndex = 0;

  const [vertexShader, fragmentShader] = useMemo(
    () => compile("stripes", "vertex"),
    []
  );

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
    // ref.current.rotation.x += 0.001;
    // ref.current.rotation.y += 0.001;
  });

  return ref;
}

type ElementType = keyof ShaderControls;

function useUniforms(
  controls: ShaderControls
): RefObject<GenerativeShaderUniforms> {
  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>(UNIFORM_DEFAULTS);
  const copyUniforms = useCallback(() => {
    Object.keys(controls).map((k) => {
      const key = k as ElementType;
      uniforms.current[key].value = controls[key];
    });
  }, [controls]);
  // animate uniforms here
  useFrame(() => {
    uniforms.current.uTime.value += SPEED * SPEED_MULTIPLIER;
    copyUniforms();
    // uniforms.current.uSeed.value = controls.uSeed;
    // uniforms.current.uColor1.value = controls.uColor1;
    // uniforms.current.uColor2.value = controls.uColor2;
    // uniforms.current.uUseColorKey.value = controls.uUseColorKey;
    // uniforms.current.uColorKeyValue.value = controls.uColorKeyValue;
    // uniforms.current.uColorNoiseScale.value = controls.uColorNoiseScale;
    // uniforms.current.uDisplacementNoiseScale.value =
    //   controls.uDisplacementNoiseScale;
    // uniforms.current.uDisplacementAmplitude.value =
    //   controls.uDisplacementAmplitude;
    // uniforms.current.uRoughness.value = controls.uRoughness;
    // uniforms.current.uClearcoat.value = controls.uClearcoat;
    // uniforms.current.uClearcoatRoughness.value = controls.uClearcoatRoughness;
    // uniforms.current.uIridescence.value = controls.uIridescence;
    // uniforms.current.uLineWidth.value = controls.uLineWidth;
  });

  return uniforms;
}
