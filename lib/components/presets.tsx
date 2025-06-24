import type { CompilerMetadata } from "../shaders/compiler";

type ShaderMetadata = Omit<CompilerMetadata, "shaderType" | "preset">;

const noop: ShaderMetadata = {
  defines: { SPEED: ".1" },
  presetType: "wireframe",
  presetStyle: "wireframe",
};
const slai: ShaderMetadata = {
  defines: { SPEED: ".1", DIST_AMP: "5.", FREQ: "1." },
  presetType: "solid",
  presetStyle: "solid",
};
const stripes: ShaderMetadata = {
  defines: {
    DIST_AMP: ".05",
    NOISE_DIST_AMP: ".1",
    SPEED: "1.",
    FREQ: "1.",
    FRAC_SCALE: "16",
  },
  presetType: "solid",
  presetStyle: "solid",
};
const linoise: ShaderMetadata = {
  defines: {
    DIST_AMP: ".05",
    NOISE_DIST_AMP: "1.",
    SPEED: "1.",
    FREQ: "1.",
    FRAC_SCALE: "16",
  },
  presetType: "wireframe",
  presetStyle: "wireframe",
};
const pnoise: ShaderMetadata = {
  defines: {
    DIST_AMP: ".05",
    NOISE_DIST_AMP: "1.",
    SPEED: "1.",
    FREQ: "1.",
    FRAC_SCALE: "16",
  },
  presetType: "wireframe",
  presetStyle: "point",
};

export const PRESET_PARAMS: Record<string, ShaderMetadata> = {
  noop,
  slai,
  stripes,
  linoise,
  pnoise,
};
