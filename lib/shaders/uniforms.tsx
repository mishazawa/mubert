//  ¯\_(ツ)_/¯
// as const

import { Matrix4 } from "three";
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
uniform sampler2D uRefractionTex;
uniform sampler2D uCustomTex;
uniform vec2 uSimulationRes;
uniform vec2 uParticlesRes;
uniform mat4 uObjectMatrix;
uniform vec3 uHui;
` as const; // hui: added here

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
    uObjectMatrix: { value: new Matrix4().identity() },
    uHui: { value: [0, 0, 0] }, // hui: add default value to prevent errors
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
