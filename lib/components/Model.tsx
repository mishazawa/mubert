import CustomShaderMaterial from "three-custom-shader-material";

import { useEffect, useMemo } from "react";

import type { ShaderControls } from "../types";

import { MESH_DETAIL } from "../constants";

import {
  PointsMaterial,
  MeshPhysicalMaterial,
  BufferGeometry,
  LineBasicMaterial,
} from "three";

import { compile, type CompilerMetadata } from "../shaders2/compiler";
import type { MaterialType } from "../shaders2/types";
import { useGeometry, useTransforms, useUniforms } from "./hooks";

const PRESET_PARAMS: Record<string, Omit<CompilerMetadata, "shaderType">> = {
  noop: {
    defines: { SPEED: ".1" },
    presetType: "wireframe",
    preset: "noop",
    presetStyle: "wireframe",
  },
  slai: {
    defines: { SPEED: ".1", DIST_AMP: "5.", FREQ: "1." },
    presetType: "solid",
    preset: "slai",
    presetStyle: "solid",
  },
};

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

  const params = PRESET_PARAMS[preset as string];
  const [vertexShader, fragmentShader, materialType] = useMemo(
    () => [
      compile({ ...params, shaderType: "vertex" }),
      compile({ ...params, shaderType: "fragment" }),
      params.presetStyle,
    ],
    [preset]
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
