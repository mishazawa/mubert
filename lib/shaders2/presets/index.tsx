import NOOP from "./noop.glsl?raw";

export type ShaderPreset = "noop";

const PRESETS: Record<ShaderPreset, string> = {
  noop: NOOP,
};

export default PRESETS;
