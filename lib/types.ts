import type { ShaderControls } from "./shaders/types";

export type CanvasProps = {
  data: ShaderControls;
  getFFT: () => number[];
  getRMS: () => [number, number];
};

export type EnvironmentLightProps = {
  intensity: number;
};
