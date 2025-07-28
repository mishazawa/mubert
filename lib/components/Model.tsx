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

  const rand = ctx.random;

  const [showWireframe, scale, detail] = useMemo(
    () => [rand.casino(0.8), rand.float(1.05, 1.2), rand.int(1, 3)],
    [ctx.data.uSeed]
  );

  const itemsw = useWireframeGeo(detail, scale);
  const itemw = itemsw[rand.int(0, itemsw.length - 1)];

  const { vertex, fragment } = ctx.debug ?? {};
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
    <lineSegments geometry={itemw} visible={!!showWireframe}>
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
  const ctx = useParameters();
  const uniforms = useSharedUniforms();
  const items = useSolidGeo(MESH_DETAIL);

  const { vertex, fragment } = ctx.debug ?? {};
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
