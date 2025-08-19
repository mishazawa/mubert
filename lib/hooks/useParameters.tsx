import {
  debugCheckerData,
  getVector3,
  isMobileUA,
  randomGenerator,
  randomSwapRange,
  type RandomGenerator,
} from "../utils";
import type { CanvasProps } from "../types";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { useColorGenerator } from "./useColorGenerator";
import {
  AUDIO_TEXTURE_SIZE,
  PARTICLES_COUNT,
  PARTICLES_TEXTURE_SIZE,
  ROTATION_SPEED,
  VALID_RANGES,
} from "../constants";
import type { ShaderControls } from "../shaders/types";
import { useCreateSharedTexture } from "./useSharedTextures";
import {
  DataTexture,
  RGBAFormat,
  RepeatWrapping,
  UnsignedByteType,
  ClampToEdgeWrapping,
  LinearFilter,
} from "three";
import { LIGHT_PRESET } from "../components/light/presets";
import { useDebug } from "./useDebug";

export type ParametersCtx = Omit<CanvasProps, "seed"> & {
  rot_speed: RefObject<number>;
  random: RandomGenerator;
  palette: Array<number[]>;
} & {
  geoShowWireframe: boolean;
  geoWireframeScale: number;
  geoWireframeDetail: number;
  geoWireframeType: number;
} & {
  data: ShaderControls;
  isMobile: boolean;
  lightPreset: number;
};

export const ParamsContext = createContext<ParametersCtx>(null!);

export function ParametersContextWrap({
  children,
  ...props
}: CanvasProps & { children: any }) {
  const isMobile = useMemo(() => {
    console.log("is mobile: " + isMobileUA());
    return isMobileUA();
  }, []);

  const gen = useMemo(() => {
    console.log("seed: " + props.seed);
    return randomGenerator(props.seed);
  }, [props.seed]);

  const rot_speed = useRef(ROTATION_SPEED);

  const palette = useColorGenerator(gen, props.seed);

  const randomizedProperties = useMemo(
    () => ({
      geoShowWireframe: !!gen.casino(0.8),
      geoWireframeScale: gen.float(1.05, 1.2),
      geoWireframeDetail: gen.int(1, 4),
      geoWireframeType: gen.int(0, 3),
    }),
    [props.seed]
  );

  const uniformData = useMemo(
    () => ({
      uSeed: props.seed,
      uLineWidth: gen.float(0, 1),
      uUseColorKey: gen.int(...VALID_RANGES.use_key),
      uColorKeyValue: gen.int(...VALID_RANGES.key_value),
      uColorNoiseScale: gen.float(
        ...randomSwapRange(VALID_RANGES.color_noise, gen.float(0, 1))
      ),
      uDisplacementNoiseScale: gen.float(
        ...randomSwapRange(VALID_RANGES.displacement_noise, gen.float(0, 1))
      ),
      uDisplacementAmplitude: gen.float(...VALID_RANGES.amplitude),
      uRoughness: gen.float(...VALID_RANGES.roughness),
      uClearcoat: gen.float(...VALID_RANGES.clearcoat),
      uClearcoatRoughness: gen.float(...VALID_RANGES.cc_roughness),
      uIridescence: gen.float(...VALID_RANGES.iridescence),
      uLineCount: gen.int(...VALID_RANGES.uLineCount),
      uNoiseOffset: getVector3(gen),
      uRoughnessPattern: gen.float(0, 1),
      uNoiseVariant: gen.float(0, 1),
      uStripesWidth: gen.float(...VALID_RANGES.uStripesWidth),
      uEmission: gen.float(0, 1),
    }),
    [props.seed]
  );

  useCreateSharedTexture(
    "uRefractionTex",
    () => {
      const size = PARTICLES_TEXTURE_SIZE;
      const tex = new DataTexture(
        debugCheckerData(size),
        size,
        size,
        RGBAFormat
      );
      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;
      tex.needsUpdate = true;
      return tex;
    },
    []
  );

  const particlesRes: [number, number] = useDebug("particlesTexture", [
    PARTICLES_COUNT,
    PARTICLES_COUNT,
  ]);

  useCreateSharedTexture(
    "uSimulationTex",
    () => {
      const [sizew, sizeh] = particlesRes;
      const tex = new DataTexture(
        debugCheckerData(sizew),
        sizew,
        sizeh,
        RGBAFormat
      );

      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;
      tex.needsUpdate = true;
      return tex;
    },
    [particlesRes]
  );

  useCreateSharedTexture(
    "uAudioTex",
    () => {
      const data = new Uint8Array(AUDIO_TEXTURE_SIZE * AUDIO_TEXTURE_SIZE * 4);
      const tex = new DataTexture(
        data,
        AUDIO_TEXTURE_SIZE,
        AUDIO_TEXTURE_SIZE,
        RGBAFormat,
        UnsignedByteType
      );
      tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
      tex.magFilter = tex.minFilter = LinearFilter;
      tex.needsUpdate = true;
      return tex;
    },
    []
  );

  const lightPreset = useMemo(
    () => gen.int(0, LIGHT_PRESET.length),
    [props.seed]
  );
  return (
    <ParamsContext
      value={{
        ...props,
        rot_speed,
        random: gen,
        palette,
        ...randomizedProperties,
        data: uniformData,
        isMobile,
        lightPreset,
      }}
    >
      {children}
    </ParamsContext>
  );
}

export function useParameters() {
  return useContext(ParamsContext);
}
