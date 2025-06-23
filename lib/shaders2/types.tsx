import type { Color, Vector2, Vector3 } from "three";
import type { UNIFORM_KEYS, GLSL_TYPES } from "./uniforms";
import type { VARYINGS_KEYS_SOLID, VARYINGS_KEYS_WIREFRAME } from "./varyings";

type UniformValue<T> = {
  value: T;
};

type VaryingKeySolid = (typeof VARYINGS_KEYS_SOLID)[number];
type VaryingKeyWireframe = (typeof VARYINGS_KEYS_WIREFRAME)[number];

export type VaryingKey<T extends "solid" | "wireframe"> = T extends "solid"
  ? VaryingKeySolid
  : VaryingKeyWireframe;

export type UniformKey = (typeof UNIFORM_KEYS)[number];
export type GlslType = (typeof GLSL_TYPES)[number];

type ShaderInt = number;
type ShaderFloat = number;
type GenerativeShaderUniforms = {
  readonly [P in UniformKey]: UniformValue<
    ShaderFloat | ShaderInt | Color | Vector3 | Vector2
  >;
};

type ProgramableUniforms = Omit<GenerativeShaderUniforms, "uTime">;

export type ShaderControls = {
  -readonly [P in keyof ProgramableUniforms]: GenerativeShaderUniforms[P] extends UniformValue<
    infer V
  >
    ? V
    : never;
};

export type MaterialType = "solid" | "point" | "wireframe";
