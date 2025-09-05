import type { BufferGeometry } from "three";

type AudioAnalysisFns = {
  getFFT: () => number[];
  getRMS: () => number;
};

export type CanvasProps = AudioAnalysisFns & {
  seed: number;
  texture?: string;
};

export type OptionalProps = {
  resolution?: number;
};

export type EnvironmentLightProps = {
  intensity: number;
};

export type RendererProps = {
  geometry: BufferGeometry;
};

export type LightPresetProps = {
  position?: [number, number, number];
  scale?: [number, number, number];
  group?: boolean;
  float?: boolean;
  isAccent?: boolean;
};
