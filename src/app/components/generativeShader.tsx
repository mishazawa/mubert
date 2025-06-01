import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color } from "three";
import shaderVert from "@/app/shader/vertex.glsl";
import shaderFrag from "@/app/shader/fragment.glsl";
import shaderVertTest from "@/app/shader/vertex_test.glsl";
import shaderFragTest from "@/app/shader/fragment_test.glsl";

type UniformValue<T> = {
  value: T;
};

// declare uniforms here
export type GenerativeShaderUniforms = {
  time: UniformValue<number>;
  color: UniformValue<Color>;
};

export const GenerativeShaderMaterial = shaderMaterial(
  // uniforms
  {},
  // vertex shader
  shaderVertTest,
  // fragment shader
  shaderFragTest
);

// declaratively
extend({ GenerativeShaderMaterial });
