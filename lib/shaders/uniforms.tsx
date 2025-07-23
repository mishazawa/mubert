//  ¯\_(ツ)_/¯
// as const

import { FFT_SIZE } from "../constants";
import type { GenerativeShaderUniforms, ShaderControls } from "./types";

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
uniform float uRMS;
uniform sampler2D uAudioTex;
uniform vec2 uRes;
uniform sampler2D uRefTex;
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
    uFFT: { value: new Array(FFT_SIZE).fill(0) },
    uColor1: { value: [0, 0, 0] },
    uColor2: { value: [0, 0, 0] },
    uColor3: { value: [0, 0, 0] },
    uColor4: { value: [0, 0, 0] },
    uColor5: { value: [0, 0, 0] },
    uRes: { value: [0, 0] },
  } as GenerativeShaderUniforms;
}

type ElementType = keyof ShaderControls;

export function assignUniforms(
  uniforms: Record<ElementType, any>,
  data: Record<ElementType, any>
) {
  Object.keys(data).map((k) => {
    const key = k as ElementType;
    uniforms[key].value = data[key];
  });
}
