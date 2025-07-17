import { Canvas } from "@react-three/fiber";
import {
  PerformanceMonitor,
  PerspectiveCamera as CameraPer,
  StatsGl,
  TrackballControls,
  useContextBridge,
} from "@react-three/drei";

import { Model } from "./components/Model";
import { EnvironmentLight } from "./components/EnvironmentLight";
import { AMBIENT_LIGHT_COLOR, VALID_RANGES } from "./constants";
import type { CanvasProps, ParametersCtx } from "./types";

import {
  getColors,
  getVector3,
  randomGenerator,
  randomSwapRange,
} from "./utils";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ShaderControls } from "./shaders/types";
import { PerspectiveCamera, type Color } from "three";
import {
  Bloom,
  Noise,
  EffectComposer,
  ChromaticAberration,
  N8AO,
  SMAA,
} from "@react-three/postprocessing";

import { BlendFunction } from "postprocessing";

export default function MubertCanvas(
  props: CanvasProps & {
    debug?: any;
  }
) {
  return (
    <ParametersContextWrap {...props}>
      <SceneWrapper />
    </ParametersContextWrap>
  );
}

function SceneWrapper() {
  const [dpr, setDpr] = useState(1);
  const ContextBridge = useContextBridge(ParamsContext);
  const ctx = useContext(ParamsContext);

  return (
    <ContextBridge>
      <Canvas className="vis_canvas" dpr={dpr}>
        <color attach="background" args={[ctx.data.uColor1 as Color]} />
        {/* TO BE REMOVED */}
        <StatsGl showPanel={1} className="stats" />
        <PerformanceMonitor
          factor={1}
          onChange={({ factor }) => setDpr(Math.floor(0.5 + 1.5 * factor))}
        />

        <EnvironmentLight intensity={1} preset={ctx.debug.light} />
        <Model />
        <LensCamera {...ctx.debug} />
        <TrackballControls
          noPan
          dynamicDampingFactor={ctx.debug.dampingFactor}
        />
        <ambientLight color={AMBIENT_LIGHT_COLOR} intensity={10} />

        <EffectComposer multisampling={0}>
          <N8AO {...ctx.debug.ao} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL} // blend mode
            offset={[
              ctx.debug.chromaticAberration,
              ctx.debug.chromaticAberration,
            ]} // color offset
          />
          <Noise opacity={ctx.debug.noise} />
          <Bloom mipmapBlur levels={7} intensity={1} />
          <SMAA />
        </EffectComposer>
      </Canvas>
    </ContextBridge>
  );
}

function LensCamera({ distance, lens }: any) {
  const cam = useRef<PerspectiveCamera>(null!);

  useEffect(() => {
    if (!cam.current) return;
    cam.current.setFocalLength(lens);
  }, [lens]);

  return (
    <CameraPer
      ref={cam}
      position={[0, 0, distance]}
      makeDefault={true}
      far={20.0}
    />
  );
}

export function generateShaderParams(uSeed: number): ShaderControls {
  const gen = randomGenerator(uSeed);
  const palette = getColors(gen);

  return {
    uSeed,
    uLineWidth: gen.float(0, 1),
    uColor1: palette[0],
    uColor2: palette[1],
    uColor3: palette[2],
    uColor4: palette[3],
    uColor5: palette[4],
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
  };
}

// TODO move somewhere
export const ParamsContext = createContext<ParametersCtx>(null!);

function ParametersContextWrap({
  children,
  ...props
}: CanvasProps & {
  debug?: any;
} & { children: any }) {
  const gen = useMemo(() => randomGenerator(props.data.uSeed), []);

  const fft = useRef({
    mix_min: Math.pow(gen.float(0, 1), 3.0) * 0.5,
    mix_max: gen.float(0.9, 1),
    max: 0,
    val: 0,
    time: 0,
  });

  const rot_speed = useRef(gen.float(0, 0.1));
  return (
    <ParamsContext value={{ ...props, fft, rot_speed }}>
      {children}
    </ParamsContext>
  );
}
