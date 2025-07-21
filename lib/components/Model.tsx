import CustomShaderMaterial from "three-custom-shader-material";
import { useEffect, useMemo } from "react";
import { Bounds } from "@react-three/drei";
import { PointsMaterial, MeshPhysicalMaterial, LineBasicMaterial } from "three";

import { MESH_DETAIL, SHADER_STYLE } from "../constants";
import { compile } from "../shaders/compiler";

import { useGeometry, useTransforms, useUniforms } from "./hooks";

import type { RendererProps } from "../types";
import { useParameters } from "../hooks/useParameters";

export function Model() {
  const ctx = useParameters();
  const ref = useTransforms();
  const uniforms = useUniforms();
  const items = useGeometry(MESH_DETAIL);

  const { vertex, fragment, preset, mesh, pointSize, style } = ctx.debug ?? {};

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
      SHADER_STYLE[
        style >= SHADER_STYLE.length ? SHADER_STYLE.length - 1 : style
      ],
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

  const visibleIndex =
    mesh >= items[materialType].length ? items[materialType].length - 1 : mesh;

  return (
    <Bounds observe margin={2} maxDuration={0}>
      <group ref={ref} position={[0, 0, 0]}>
        <group visible={materialType === "solid"}>
          {items.solid.map((i, idx) => (
            <RenderSolid
              key={idx}
              geometry={i}
              visible={idx === visibleIndex}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms.current}
            />
          ))}
        </group>
        <group visible={materialType === "point"}>
          {items.point.map((i, idx) => (
            <RenderPoints
              key={idx}
              geometry={i}
              visible={idx === visibleIndex}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms.current}
              size={pointSize}
            />
          ))}
        </group>
        <group visible={materialType === "wireframe"}>
          {items.wireframe.map((i, idx) => (
            <RenderLines
              key={idx}
              geometry={i}
              visible={idx === visibleIndex}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms.current}
            />
          ))}
        </group>
      </group>
    </Bounds>
  );
}

function RenderPoints({
  geometry,
  visible,
  ...props
}: RendererProps & { size: number }) {
  return (
    <points geometry={geometry} visible={visible}>
      <CustomShaderMaterial
        baseMaterial={PointsMaterial}
        {...props}
        transparent
        toneMapped={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

function RenderLines({ geometry, visible, ...props }: RendererProps) {
  return (
    <lineSegments geometry={geometry} visible={visible}>
      <CustomShaderMaterial
        baseMaterial={LineBasicMaterial}
        {...props}
        toneMapped={false}
        linewidth={1}
      />
    </lineSegments>
  );
}

function RenderSolid({ geometry, visible, ...props }: RendererProps) {
  return (
    <mesh geometry={geometry} visible={visible}>
      <CustomShaderMaterial
        baseMaterial={MeshPhysicalMaterial}
        {...props}
        roughness={1}
        iridescence={1}
        toneMapped={false}
        clearcoat={1}
      />
    </mesh>
  );
}
