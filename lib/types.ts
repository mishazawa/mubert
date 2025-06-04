import type { Color } from "three";

type UniformValue<T> = {
  value: T;
};

// declare uniforms here
export type GenerativeShaderUniforms = {
  time: UniformValue<number>;
  color1: UniformValue<Color>;
  color2: UniformValue<Color>;
};

export type EnvironmentLightProps = {
  intensity: number;
};
