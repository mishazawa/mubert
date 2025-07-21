import NOOP from "./noop.glsl?raw";
import SLAI from "./slai5.glsl?raw";
import SLAI_FLAT from "./slai_flat.glsl?raw";
import STRIPES from "./stripes.glsl?raw";
import LINOISE from "./linoise.glsl?raw";
import PNOISE from "./pnoise.glsl?raw";
import DEBUG from "./debug.glsl?raw";
import FRESNEL from "./fresnel.glsl?raw";

export type ShaderPreset =
  | "noop"
  | "slai"
  | "stripes"
  | "linoise"
  | "pnoise"
  | "debug"
  | "slai_flat"
  | "fresnel";

const PRESETS: Record<ShaderPreset, string> = {
  noop: NOOP,
  slai: SLAI,
  stripes: STRIPES,
  linoise: LINOISE,
  pnoise: PNOISE,
  debug: DEBUG,
  slai_flat: SLAI_FLAT,
  fresnel: FRESNEL,
};

export default PRESETS;
