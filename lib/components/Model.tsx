import CustomShaderMaterial from "three-custom-shader-material";
import { useMemo } from "react";
import { Bounds } from "@react-three/drei";
import { LineBasicMaterial, MeshPhysicalMaterial } from "three";

import { MESH_DETAIL } from "../constants";
import { compile } from "../shaders/compiler";

import { useParameters } from "../hooks/useParameters";
import { useSharedUniforms } from "../hooks/useSharedUniforms";
import { useSharedTextures } from "../hooks/useSharedTextures";
import { useSolidGeo, useWireframeGeo } from "../hooks/useGeometryGenerator";
import { useDebug } from "../hooks/useDebug";

export function Model() {
  return (
    <Bounds observe margin={2} maxDuration={0}>
      <group>
        <RenderSolid />
        <RenderLines />
      </group>
    </Bounds>
  );
}

function RenderLines() {
  const ctx = useParameters();
  const uniforms = useSharedUniforms();

  const itemsw = useWireframeGeo();
  const itemw = itemsw[ctx.geoWireframeType];

  const vertex = useDebug("vertex", false);
  const fragment = useDebug("fragment", false);

  const { uRefractionTex } = useSharedTextures();

  const [vertexShaderWire, fragmentShaderWire] = useMemo(
    () => [
      compile({
        presetStyle: "wireframe",
        shaderType: "vertex",
        preset: vertex ? "debug" : "slai",
        defines: {
          REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width}`,
        },
      }),
      compile({
        presetStyle: "wireframe",
        shaderType: "fragment",
        preset: fragment ? "debug" : "slai",
        defines: {
          REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width}`,
        },
      }),
    ],
    [vertex, fragment]
  );

  return (
    <lineSegments geometry={itemw} visible={ctx.geoShowWireframe}>
      <CustomShaderMaterial
        baseMaterial={LineBasicMaterial}
        uniforms={uniforms.current}
        vertexShader={vertexShaderWire}
        fragmentShader={fragmentShaderWire}
        toneMapped={false}
        linewidth={2}
      />
    </lineSegments>
  );
}

function RenderSolid() {
  const uniforms = useSharedUniforms();
  const items = useSolidGeo(MESH_DETAIL);

  const vertex = useDebug("vertex", false);
  const fragment = useDebug("fragment", false);

  const { uRefractionTex } = useSharedTextures();

  const [vertexShader, fragmentShader] = useMemo(
    () => [
      compile({
        presetStyle: "solid",
        shaderType: "vertex",
        preset: vertex ? "debug" : "slai",
        defines: {
          REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width}`,
        },
      }),
      compile({
        presetStyle: "solid",
        shaderType: "fragment",
        preset: fragment ? "debug" : "slai",
        defines: {
          REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width}`,
        },
      }),
    ],
    [vertex, fragment]
  );

  return (
    <mesh geometry={items.solid}>
      <CustomShaderMaterial
        uniforms={uniforms.current}
        baseMaterial={MeshPhysicalMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        roughness={1}
        iridescence={1}
        toneMapped={false}
        clearcoat={1}
      />
    </mesh>
  );
}
