//  ¯\_(ツ)_/¯
// as const

import type { GenerativeShaderUniforms } from "./types";

// does not support multiple spaces between tokens
export const UNIFORMS = `
uniform float uTime;
uniform float uSeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform float uUseColorKey;
uniform float uColorKeyValue;
uniform float uColorNoiseScale;
uniform float uDisplacementNoiseScale;
uniform float uDisplacementAmplitude;
uniform float uRoughness;
uniform float uClearcoat;
uniform float uClearcoatRoughness;
uniform float uIridescence;
uniform float uLineWidth;
uniform int uLineCount;
uniform vec3 uNoiseOffset;
uniform float uRoughnessPattern;
uniform float uNoiseVariant;
uniform float uStripesWidth;
uniform float uEmission;
uniform sampler2D uRefTex;
uniform float uRMS;
uniform sampler2D uAudioTex;
uniform vec2 uRes;
` as const;

export function generateDefaults() {
  return {
    ...UNIFORMS.split(";\n")
      .filter((l) => l)
      .map((line) => line.split(" ")[2])
      .reduce((acc, i) => {
        acc[i] = { value: 0 };
        return acc;
      }, {} as Record<string, any>),
    uFFT: { value: [1] },
  } as GenerativeShaderUniforms;
}
