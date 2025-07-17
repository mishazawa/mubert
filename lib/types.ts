import type { RefObject } from "react";
import type { ShaderControls } from "./shaders/types";
import type { BufferGeometry } from "three";

export type ParametersCtx = CanvasProps & {
  debug?: any;
} & {
  fft: RefObject<FFTTexture>;
  rot_speed: RefObject<number>;
};

type FFTTexture = {
  mix_min: number;
  mix_max: number;
  max: number;
  val: number;
  time: number;
};

type AudioAnalysisFns = {
  getFFT: () => number[];
  getRMS: () => [number, number];
};

export type CanvasProps = AudioAnalysisFns & {
  data: ShaderControls;
};

export type EnvironmentLightProps = {
  intensity: number;
  preset: number;
};

export type RendererProps = {
  visible: boolean;
  geometry: BufferGeometry;
  vertexShader: string;
  fragmentShader: string;
  uniforms: any;
};

export type LightPresetProps = {
  position?: [number, number, number];
  scale?: [number, number, number];
  group?: boolean;
  float?: boolean;
};
