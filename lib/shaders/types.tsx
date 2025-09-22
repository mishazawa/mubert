import type { DataTexture, Matrix4, Vector2, Vector3, Vector4 } from "three";

import type { SHADER_STYLE } from "../constants";
import type { UNIFORMS } from "./uniforms";

export type UniformValue<T> = {
  value: T;
};

export type MaterialType = (typeof SHADER_STYLE)[number];

type Uniforms = ParseUniforms<typeof UNIFORMS> & { uFFT: number[] };

export type GenerativeShaderUniforms = {
  readonly [P in keyof Uniforms]: UniformValue<Uniforms[P]>;
};

type NotGeneratedUniforms =
  | "uHui" // hui: add uniform here if u want to program it manually somewhere
  | "uUseTex"
  | "uTime"
  | "uFFT"
  | "uRMS"
  | "uAudioTex"
  | "uRefractionTex"
  | "uCustomTex"
  | "uColor1"
  | "uColor2"
  | "uColor3"
  | "uColor4"
  | "uColor5"
  | "uParticlesRes"
  | "uSimulationRes"
  | "uRotationAxis"
  | "uObjectMatrix";

type ProgramableUniforms = Omit<GenerativeShaderUniforms, NotGeneratedUniforms>;

export type ShaderControls = {
  -readonly [P in keyof ProgramableUniforms]: GenerativeShaderUniforms[P] extends UniformValue<
    Uniforms[P]
  >
    ? Uniforms[P]
    : never;
};

// uniform parser

type GlslToTsMap = {
  float: number;
  int: number;
  bool: boolean;
  vec2: Vector2 | [number, number];
  vec3: Vector3 | [number, number, number];
  vec4: Vector4 | [number, number, number, number];
  mat4: Matrix4;
  sampler2D: DataTexture;
};

type GlslToTs<T extends string> = T extends keyof GlslToTsMap
  ? GlslToTsMap[T]
  : never;

type ParseUniformLine<L extends string> =
  L extends `uniform ${infer Type} ${infer Name};`
    ? { [K in Name]: GlslToTs<Type> }
    : {};

type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof A
    ? A[K]
    : K extends keyof B
    ? B[K]
    : never;
};

type MergeAll<T extends Record<string, any>[], Acc = {}> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends Record<string, any>
    ? Rest extends Record<string, any>[]
      ? MergeAll<Rest, Merge<Acc, First>>
      : Merge<Acc, First>
    : Acc
  : Acc;

type Split<
  S extends string,
  Acc extends string[] = []
> = S extends `${infer Line}\n${infer Rest}`
  ? Split<Rest, [...Acc, Line]>
  : S extends ""
  ? Acc
  : [...Acc, S];

type ParseUniformLines<T extends string[]> = {
  [K in keyof T]: T[K] extends string ? ParseUniformLine<T[K]> : {};
};

export type ParseUniforms<S extends string> = MergeAll<
  ParseUniformLines<Split<S>>
>;
