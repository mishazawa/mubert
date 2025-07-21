import { randomGenerator, type RandomGenerator } from "../utils";
import type { CanvasProps, FFTTexture } from "../types";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { DataTexture, RepeatWrapping, RGBAFormat } from "three";

export type ParametersCtx = CanvasProps & {
  debug?: any;
} & {
  fft: RefObject<FFTTexture>;
  rot_speed: RefObject<number>;
  random: RandomGenerator;
  ref_texture: RefObject<DataTexture>;
};

// TODO move somewhere
export const ParamsContext = createContext<ParametersCtx>(null!);

export function ParametersContextWrap({
  children,
  ...props
}: CanvasProps & {
  debug?: any;
} & { children: any }) {
  const gen = useMemo(() => randomGenerator(props.data.uSeed), []);

  const fft = useRef({
    mix_min: 0.05,
    mix_max: 0.2,
    max: 0,
    val: 0,
    time: 0,
  });

  const tex = useMemo(() => {
    // Create checkerboard texture
    const size = props.debug.particlesCount;
    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const checker = ((x >> 4) + (y >> 4)) & 1;
        const color = checker ? 255 : 0;

        data[i] = color; // R
        data[i + 1] = color; // G
        data[i + 2] = color; // B
        data[i + 3] = 255; // A
      }
    }

    const tex = new DataTexture(data, size, size, RGBAFormat);
    tex.needsUpdate = true;
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    return tex;
  }, [props.debug.particlesCount]);

  const ref_texture = useRef(tex);

  const rot_speed = useRef(0.05);

  return (
    <ParamsContext
      value={{
        ...props,
        fft,
        rot_speed,
        random: gen,
        ref_texture,
      }}
    >
      {children}
    </ParamsContext>
  );
}

export function useParameters() {
  return useContext(ParamsContext);
}
