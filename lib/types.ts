import type { BufferGeometry, Vector3 } from "three";

type AudioAnalysisFns = {
  getFFT: () => number[];
  getRMS: () => number;
};

export type CanvasProps = AudioAnalysisFns & {
  seed: number;
  texture?: string;
};

export type PropsPalette = [string, string, string, string, string];

export type OptionalProps = {
  resolution?: number;
  customPalette?: PropsPalette;
  hui?: Vector3; // hui: define optional parameter for component
  smoothFFTmin?: 0.5 | number;
  smoothFFTmax?: 0.5 | number;
  smoothRMS?: 0.5 | number;
  useTex: true,
  texPath: null | string,
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
