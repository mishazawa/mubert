import type { Color } from "three";

type UniformValue<T> = {
  value: T;
};

// declare uniforms here
export type GenerativeShaderUniforms = {
  readonly uTime: UniformValue<number>;
  readonly uSeed: UniformValue<number>;
  readonly uColor1: UniformValue<Color>;
  readonly uColor2: UniformValue<Color>;
  readonly uUseColorKey: UniformValue<number>;
  readonly uColorKeyValue: UniformValue<number>;
  readonly uColorNoiseScale: UniformValue<number>;
  readonly uDisplacementNoiseScale: UniformValue<number>;
  readonly uDisplacementAmplitude: UniformValue<number>;
  readonly uRoughness: UniformValue<number>;
  readonly uClearcoat: UniformValue<number>;
  readonly uClearcoatRoughness: UniformValue<number>;
  readonly uIridescence: UniformValue<number>;
};

type ProgramableUniforms = Omit<GenerativeShaderUniforms, "uTime">;

export type ShaderControls = {
  -readonly [P in keyof ProgramableUniforms]: GenerativeShaderUniforms[P] extends UniformValue<
    infer V
  >
    ? V
    : never;
};

export type EnvironmentLightProps = {
  intensity: number;
};
