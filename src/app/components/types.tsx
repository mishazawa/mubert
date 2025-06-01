import { RefObject } from "react";
import { Color } from "three";

// declare here data protocols aka interfaces

// data from audio analysis
export type AnalysisData = {
  fft: Uint8Array<ArrayBufferLike>;
  playtime: number;
  abstime: number;
};

export type CanvasProps = {
  audio: RefObject<HTMLAudioElement>;
};

// data from API
export type ApiProps = {
  bpm: number;
};

// uniforms known to shader
// declare everything to avoid bugs
export type GenerativeShaderUniforms = {
  time: UniformValue<number>;
  color: UniformValue<Color>;
};

type UniformValue<T> = {
  value: T;
};
