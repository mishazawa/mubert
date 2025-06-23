import NOOP from "./noop.glsl?raw";
import SLAI from "./slai.glsl?raw";

export type ShaderPreset = "noop" | "slai";

const PRESETS: Record<ShaderPreset, string> = {
  noop: NOOP,
  slai: SLAI,
};

export default PRESETS;
