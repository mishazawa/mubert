import CustomShaderMaterial from "three-custom-shader-material";

import { useMemo } from "react";

import type { ShaderControls } from "../types";

import { MESH_DETAIL } from "../constants";

import { PointsMaterial, MeshPhysicalMaterial, BufferGeometry } from "three";

import { compile } from "../shaders/compiler";
import { useGeometry, useTransforms, useUniforms } from "./hooks";

export function Model({
  data,
  debug,
}: {
  data: ShaderControls;
  debug?: Record<string, any>;
}) {
  const { vertex, fragment, preset, mesh, polygon, speed = 1 } = debug ?? {};

  const ref = useTransforms();
  const uniforms = useUniforms(data, speed);
  const items = useGeometry(polygon * MESH_DETAIL);

  const visibleIndex = mesh ?? 2;

  const [vertexShader, fragmentShader, isPoints] = useMemo(
    () =>
      compile(preset, vertex ? "vertex" : fragment ? "fragment" : undefined),
    [vertex, fragment, preset]
  );

  return (
    <group ref={ref}>
      {items.map((i, idx) => (
        <PointedGeometry
          usePoints={isPoints}
          key={idx}
          geometry={i}
          visible={idx === visibleIndex}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms.current}
        />
      ))}
    </group>
  );
}

function PointedGeometry({
  usePoints,
  geometry,
  visible,
  ...props
}: {
  usePoints: boolean;
  visible: boolean;
  geometry: BufferGeometry;
  vertexShader: string;
  fragmentShader: string;
  uniforms: any;
}) {
  if (usePoints)
    return (
      <points geometry={geometry} visible={visible}>
        <CustomShaderMaterial
          baseMaterial={PointsMaterial}
          {...props}
          transparent
          size={0.01}
        />
      </points>
    );
  return (
    <mesh geometry={geometry} visible={visible}>
      <CustomShaderMaterial
        baseMaterial={MeshPhysicalMaterial}
        {...props}
        roughness={0}
        iridescence={1}
        clearcoat={1}
      />
    </mesh>
  );
}
