import type { Color } from "three";

type UniformValue<T> = {
  value: T;
};

// declare uniforms here
export type GenerativeShaderUniforms = {
  uTime: UniformValue<number>;
  uColor1: UniformValue<Color>;
  uColor2: UniformValue<Color>;
};

export type EnvironmentLightProps = {
  intensity: number;
};
