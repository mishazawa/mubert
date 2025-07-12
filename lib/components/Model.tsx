import CustomShaderMaterial from "three-custom-shader-material";

import { useEffect, useMemo, useRef } from "react";

import type { CanvasProps } from "../types";

import { MESH_DETAIL, SHADER_STYLE } from "../constants";

import {
  PointsMaterial,
  MeshPhysicalMaterial,
  BufferGeometry,
  LineBasicMaterial,
} from "three";

import { compile } from "../shaders/compiler";

import { useGeometry, useTransforms, useUniforms } from "./hooks";
import { Bounds, useHelper } from "@react-three/drei";
import { VertexNormalsHelper } from "three/examples/jsm/Addons.js";

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
    pointSize,
    speed = 1,
    style,
  } = debug ?? {};
  const ref = useTransforms();
  const uniforms = useUniforms(data, speed, fns);
  const items = useGeometry(MESH_DETAIL);

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
type RendererProps = {
  visible: boolean;
  geometry: BufferGeometry;
  vertexShader: string;
  fragmentShader: string;
  uniforms: any;
};

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
  const meshRef = useRef(null!);
  useHelper(false && visible && meshRef, VertexNormalsHelper, 0.1, 0xff0000);

  return (
    <mesh ref={meshRef} geometry={geometry} visible={visible}>
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
