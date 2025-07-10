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
import { Bounds } from "@react-three/drei";

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

  // show only spheric lines for edge material

  const visibleIndex = getOffsetByShaderStyle(mesh, style);

  return (
    <Bounds fit observe margin={1.2} maxDuration={0}>
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
    </Bounds>
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
          size={0.05}
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
        roughness={1}
        iridescence={1}
        clearcoat={1}
      />
    </mesh>
  );
}

// lines -> 8, 9, 10, 11
// wireframe -> 4, 5, 6, 7
// solid -> 1, 2, 3, 4
function getOffsetByShaderStyle(mesh: number, style: number): number {
  if (style === 3) return mesh + 8;
  if (style === 2) return mesh + 4;
  return mesh;
}
