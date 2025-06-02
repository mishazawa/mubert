import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color } from "three";
// import vertexShader from "../shaders/vertex.glsl";
// import fragmentShader from "../shaders/fragment.glsl";
import vertexShader from "../shaders/vertex_noise.glsl";
import fragmentShader from "../shaders/fragment_noise.glsl";

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
  vertexShader,
  // fragment shader
  fragmentShader
);

// declaratively
extend({ GenerativeShaderMaterial });
