import NOOP from "./noop.glsl?raw";
import SLAI from "./slai.glsl?raw";
import STRIPES from "./stripes.glsl?raw";
import LINOISE from "./linoise.glsl?raw";
import PNOISE from "./pnoise.glsl?raw";
import DEBUG from "./debug.glsl?raw";

export type ShaderPreset =
  | "noop"
  | "slai"
  | "stripes"
  | "linoise"
  | "pnoise"
  | "debug";

const PRESETS: Record<ShaderPreset, string> = {
  noop: NOOP,
  slai: SLAI,
  stripes: STRIPES,
  linoise: LINOISE,
  pnoise: PNOISE,
  debug: DEBUG,
};

export default PRESETS;
