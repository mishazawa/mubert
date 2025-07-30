import { randomGenerator, type RandomGenerator } from "../utils";
import type { CanvasProps, FFTTexture } from "../types";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { useColorGenerator } from "./useColorGenerator";

export type ParametersCtx = CanvasProps & {
  debug?: any;
} & {
  fft: RefObject<FFTTexture>;
  rot_speed: RefObject<number>;
  random: RandomGenerator;
  palette: Array<number[]>;
} & {
  geoShowWireframe: boolean;
  geoWireframeScale: number;
  geoWireframeDetail: number;
  geoWireframeType: number;
};

// TODO move somewhere
export const ParamsContext = createContext<ParametersCtx>(null!);

export function ParametersContextWrap({
  children,
  ...props
}: CanvasProps & {
  debug?: any;
} & { children: any }) {
  const gen = useMemo(
    () => randomGenerator(props.data.uSeed),
    [props.data.uSeed]
  );

  const fft = useRef({
    mix_min: 0.05,
    mix_max: 0.2,
    max: 0,
    val: 0,
    time: 0,
  });

  const rot_speed = useRef(0.05);

  const palette = useColorGenerator(gen, props.data.uSeed);

  const randomizedProperties = {
    geoShowWireframe: !!gen.casino(0.8),
    geoWireframeScale: gen.float(1.05, 1.2),
    geoWireframeDetail: gen.int(1, 4),
    geoWireframeType: gen.int(0, 3),
  };

  return (
    <ParamsContext
      value={{
        ...props,
        fft,
        rot_speed,
        random: gen,
        palette,
        ...randomizedProperties,
      }}
    >
      {children}
    </ParamsContext>
  );
}

export function useParameters() {
  return useContext(ParamsContext);
}
