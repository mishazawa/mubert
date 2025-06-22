import CustomShaderMaterial from "three-custom-shader-material";

import { useMemo } from "react";

import type { ShaderControls } from "../types";

import { MESH_DETAIL } from "../constants";

import {
  PointsMaterial,
  MeshPhysicalMaterial,
  BufferGeometry,
  LineBasicMaterial,
} from "three";

import { compile, type MaterialType } from "../shaders/compiler";
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

  const [vertexShader, fragmentShader, matType] = useMemo(
    () =>
      compile(preset, vertex ? "vertex" : fragment ? "fragment" : undefined),
    [vertex, fragment, preset]
  );

  // show only spheric lines for edge material
  const visibleIndex = matType === "edges" ? 3 : mesh;

  return (
    <group ref={ref}>
      {items.map((i, idx) => (
        <PointedGeometry
          materialType={matType}
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
  materialType,
  geometry,
  visible,
  ...props
}: {
  materialType: MaterialType;
  visible: boolean;
  geometry: BufferGeometry;
  vertexShader: string;
  fragmentShader: string;
  uniforms: any;
}) {
  if (materialType === "point")
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

  if (materialType === "edges") {
    return (
      <lineSegments geometry={geometry} visible={visible}>
        <CustomShaderMaterial
          baseMaterial={LineBasicMaterial}
          {...props}
          linewidth={1}
        />
      </lineSegments>
    );
  }

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
