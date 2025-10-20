import type { BufferGeometry } from "three";

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
  dpr?: 1 | 2;
  customPalette?: PropsPalette;
  // hui?: Vector3; // hui: define optional parameter for component
  smoothFFT?: [number, number];
  smoothRMS?: [number, number];
  rmsSpeed?: number;
  useTex?: boolean;
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
