import { Color } from "three";
import type { GenerativeShaderUniforms } from "./types";

export const ENV_MAP_RESOLUTION = 256;
export const SPEED = 10; // suppose to be bpm?
export const SPEED_MULTIPLIER = 0.001;
export const MESH_DETAIL = 256;
export const AMBIENT_LIGHT_COLOR = 0x404040;

export const VALID_RANGES: Record<string, [number, number]> = {
  use_key: [0, 2], // not included 2
  key_value: [0, 2], // not included 2
  color_noise: [0.5, 20],
  displacement_noise: [0.01, 2],
  amplitude: [0.01, 0.5],
  roughness: [0, 1],
  clearcoat: [0, 5],
  cc_roughness: [0, 1],
  iridescence: [0, 5],
  uLineCount: [0, 5],
};

const DEFAULT_COLOR = new Color("#fff");
export const UNIFORM_DEFAULTS: GenerativeShaderUniforms = {
  uTime: { value: 0 },
  uSeed: { value: 0 },
  uColor1: { value: DEFAULT_COLOR },
  uColor2: { value: DEFAULT_COLOR },
  uColor3: { value: DEFAULT_COLOR },
  uColor4: { value: DEFAULT_COLOR },
  uColor5: { value: DEFAULT_COLOR },
  uUseColorKey: { value: 0 },
  uColorKeyValue: { value: 0 },
  uColorNoiseScale: {
    value: 0,
  },
  uDisplacementNoiseScale: {
    value: 0,
  },
  uDisplacementAmplitude: {
    value: 0,
  },
  uRoughness: {
    value: 0,
  },
  uClearcoat: {
    value: 0,
  },
  uClearcoatRoughness: {
    value: 0,
  },
  uIridescence: {
    value: 0,
  },
  uLineWidth: {
    value: 0.1,
  },
  uLineCount: {
    value: 0,
  },
};
