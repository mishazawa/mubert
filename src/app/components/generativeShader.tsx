import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color } from "three";
import shaderVert from "@/app/shader/vertex.glsl";
import shaderFrag from "@/app/shader/fragment.glsl";

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
  shaderVert,
  // fragment shader
  shaderFrag
);

// declaratively
extend({ GenerativeShaderMaterial });
