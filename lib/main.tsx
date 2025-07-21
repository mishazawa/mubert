import { Canvas } from "@react-three/fiber";
import {
  PerspectiveCamera as CameraPer,
  StatsGl,
  TrackballControls,
  useContextBridge,
  Icosahedron,
  useFBO,
} from "@react-three/drei";

import { EnvironmentLight } from "./components/EnvironmentLight";
import { AMBIENT_LIGHT_COLOR, FBO_SIZE, VALID_RANGES } from "./constants";
import type { CanvasProps, ParametersCtx } from "./types";

import {
  getColors,
  getVector3,
  randomGenerator,
  randomSwapRange,
} from "./utils";

import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import type { ShaderControls } from "./shaders/types";
import {
  DataTexture,
  FloatType,
  PerspectiveCamera,
  RepeatWrapping,
  RGBAFormat,
  type Color,
} from "three";

import { FX } from "./effects";
import { VelocityFieldPass } from "./components/Particles";

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

const initialPositions = [
  [-4, 20, -12],
  [-10, 12, -4],
  [-11, -12, -23],
  [-16, -6, -10],
  [12, -2, -3],
  [13, 4, -12],
  [14, -2, -23],
  [8, 10, -20],
];

function SceneWrapper() {
  const ContextBridge = useContextBridge(ParamsContext);
  const ctx = useContext(ParamsContext);

  return (
    <ContextBridge>
      <Canvas className="vis_canvas" dpr={1}>
        <color attach="background" args={[ctx.data.uColor1 as Color]} />
        {/* TO BE REMOVED */}
        <StatsGl showPanel={1} className="stats" />

        <EnvironmentLight intensity={10} preset={ctx.debug.light} />
        <Suspense fallback={null}>
          <VelocityFieldPass />
          {/* <Model /> */}

          {!ctx.debug.background
            ? null
            : initialPositions.map((pos, i) => (
                <Icosahedron
                  args={[1, 8]}
                  position={[pos[0] * 0.5, pos[1] * 0.5, pos[2] * 0.5]}
                  key={i}
                />
              ))}
        </Suspense>

        <LensCamera {...ctx.debug} />
        <TrackballControls
          noPan
          dynamicDampingFactor={ctx.debug.dampingFactor}
        />
        <ambientLight color={AMBIENT_LIGHT_COLOR} intensity={10} />
        <FX />
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
    mix_min: 0.05,
    mix_max: 0.2,
    max: 0,
    val: 0,
    time: 0,
  });

  const ref_texture = useMemo(() => {
    // Create checkerboard texture
    const size = 128;
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
  }, []);

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
