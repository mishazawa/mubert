import type { GlslType, VaryingKey } from "./types";

export const VARYINGS_KEYS_SOLID = [
  "vUv",
  "vPosition",
  "vPositionD",
  "vNormalD",
] as const;

export const VARYINGS_KEYS_WIREFRAME = [
  ...VARYINGS_KEYS_SOLID,
  "vNormal",
] as const;

export const VARYINGS_SOLID: Record<VaryingKey<"solid">, GlslType> = {
  vUv: "vec2",
  vPosition: "vec3",
  vPositionD: "vec3",
  vNormalD: "vec3",
};

export const VARYINGS_WIRE: Record<VaryingKey<"wireframe">, GlslType> = {
  vUv: "vec2",
  vPosition: "vec3",
  vPositionD: "vec3",
  vNormal: "vec3",
  vNormalD: "vec3",
};
