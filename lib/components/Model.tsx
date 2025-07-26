import CustomShaderMaterial from "three-custom-shader-material";
import { useMemo } from "react";
import { Bounds } from "@react-three/drei";
import { MeshPhysicalMaterial, LineBasicMaterial } from "three";

import { MESH_DETAIL } from "../constants";
import { compile } from "../shaders/compiler";

import { useGeometry, useTransforms } from "./hooks";

import { useParameters } from "../hooks/useParameters";
import { useSharedUniforms } from "../hooks/useSharedUniforms";
import { useSharedTextures } from "../hooks/useSharedTextures";

export function Model() {
  const ctx = useParameters();

  return (
    <Bounds observe margin={2} maxDuration={0}>
      <group visible={!ctx.debug.onlyParticles}>
        <RenderSolid />
        <RenderLines />
      </group>
    </Bounds>
  );
}

function RenderLines() {
  const ctx = useParameters();
  const uniforms = useSharedUniforms();
  const items = useGeometry(MESH_DETAIL);

  const { vertex, fragment, preset } = ctx.debug ?? {};
  const { uRefractionTex } = useSharedTextures();

  const [vertexShaderWire, fragmentShaderWire] = useMemo(
    () => [
      compile({
        presetStyle: "wireframe",
        shaderType: "vertex",
        preset: vertex ? "debug" : preset,
        defines: {
          REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width}`,
        },
      }),
      compile({
        presetStyle: "wireframe",
        shaderType: "fragment",
        preset: fragment ? "debug" : preset,
        defines: {
          REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width}`,
        },
      }),
    ],
    [preset, vertex, fragment]
  );
  return (
    <lineSegments geometry={items.wireframe} visible={ctx.debug.showWireframe}>
      <CustomShaderMaterial
        baseMaterial={LineBasicMaterial}
        uniforms={uniforms.current}
        vertexShader={vertexShaderWire}
        fragmentShader={fragmentShaderWire}
        toneMapped={false}
        linewidth={1}
      />
    </lineSegments>
  );
}

function RenderSolid() {
  const ctx = useParameters();
  const uniforms = useSharedUniforms();
  const items = useGeometry(MESH_DETAIL);

  const { vertex, fragment, preset } = ctx.debug ?? {};
  const { uRefractionTex } = useSharedTextures();

  const [vertexShader, fragmentShader] = useMemo(
    () => [
      compile({
        presetStyle: "solid",
        shaderType: "vertex",
        preset: vertex ? "debug" : preset,
        defines: {
          REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width}`,
        },
      }),
      compile({
        presetStyle: "solid",
        shaderType: "fragment",
        preset: fragment ? "debug" : preset,
        defines: {
          REFRACTION_TEXTURE_SIZE: `${uRefractionTex.current.image.width}`,
        },
      }),
    ],
    [preset, vertex, fragment]
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
