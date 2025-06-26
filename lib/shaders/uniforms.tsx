//  ¯\_(ツ)_/¯
// as const
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
` as const;
