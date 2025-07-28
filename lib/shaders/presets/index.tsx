import SLAI from "./slai.glsl?raw";
import DEBUG from "./debug.glsl?raw";

export type ShaderPreset = "slai" | "debug";

const PRESETS: Record<ShaderPreset, string> = {
  slai: SLAI,
  debug: DEBUG,
};

export default PRESETS;
