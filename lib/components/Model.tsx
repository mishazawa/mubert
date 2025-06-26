import CustomShaderMaterial from "three-custom-shader-material";

import { useEffect, useMemo } from "react";

import type { CanvasProps } from "../types";

import { MESH_DETAIL, SHADER_STYLE } from "../constants";

import {
  PointsMaterial,
  MeshPhysicalMaterial,
  BufferGeometry,
  LineBasicMaterial,
} from "three";

import { compile } from "../shaders/compiler";
import type { MaterialType } from "../shaders/types";
import { useGeometry, useTransforms, useUniforms } from "./hooks";

export function Model({
  data,
  debug,
  ...fns
}: CanvasProps & {
  debug?: Record<string, any>;
}) {
  const {
    vertex,
    fragment,
    preset,
    mesh,
    polygon,
    speed = 1,
    style,
  } = debug ?? {};

  const ref = useTransforms();
  const uniforms = useUniforms(data, speed, fns);
  const items = useGeometry(polygon * MESH_DETAIL);

  const [vertexShader, fragmentShader, materialType] = useMemo(
    () => [
      compile({
        presetStyle: SHADER_STYLE[style],
        shaderType: "vertex",
        preset: vertex ? "debug" : preset,
      }),
      compile({
        presetStyle: SHADER_STYLE[style],
        shaderType: "fragment",
        preset: fragment ? "debug" : preset,
      }),
      SHADER_STYLE[style],
    ],
    [preset, vertex, fragment, style]
  );

  // debug
  useEffect(() => {
    console.groupCollapsed("Shader Code");
    console.log(vertexShader);
    console.log(fragmentShader);
    console.groupEnd();
  }, [vertexShader, fragmentShader]);

  // show only spheric lines for edge material
  const visibleIndex = materialType === "wireframe" ? 3 : mesh;

  return (
    <group ref={ref}>
      {items.map((i, idx) => (
        <PointedGeometry
          materialType={materialType}
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

  if (materialType === "wireframe") {
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
