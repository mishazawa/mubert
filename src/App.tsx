import { useRef } from "react";
import Canvas from "../lib/main";
import { button, useControls } from "leva";
import type { ShaderControls } from "../lib/types";
import { Color, MathUtils } from "three";

function App() {
  const data = useShaderState();
  return <Canvas data={data} />;
}

export default App;

const MAX_SEED = 2048;

function useShaderState() {
  const ref = useRef<ShaderControls>(generateRandomParameters(0));

  useControls({
    Generate: button(() => {
      ref.current = generateRandomParameters(Math.random() * MAX_SEED);
    }),
    seed: {
      value: ref.current.uSeed,
      step: 1,
      onChange: (v) => {
        ref.current.uSeed = v;
      },
    },
    primary: {
      value: "#f00",
      onChange: (v) => {
        ref.current.uColor1 = new Color(v);
      },
    },
    secondary: {
      value: "#f00",
      onChange: (v) => {
        ref.current.uColor2 = new Color(v);
      },
    },
    use_key: {
      value: ref.current.uUseColorKey,
      min: 0,
      max: 1,
      step: 1,
      onChange: (v) => {
        ref.current.uUseColorKey = v;
      },
    },
    key_value: {
      value: ref.current.uColorKeyValue,
      min: 0,
      max: 1,
      step: 1,
      onChange: (v) => {
        ref.current.uColorKeyValue = v;
      },
    },
    color_noise: {
      value: ref.current.uColorNoiseScale,
      min: 0.5,
      max: 20,
      onChange: (v) => {
        ref.current.uColorNoiseScale = v;
      },
    },
    displacement_noise: {
      value: ref.current.uDisplacementNoiseScale,
      min: 0.01,
      max: 2,
      onChange: (v) => {
        ref.current.uDisplacementNoiseScale = v;
      },
    },
    amplitude: {
      value: ref.current.uDisplacementAmplitude,
      min: 0.01,
      max: 0.5,
      onChange: (v) => {
        ref.current.uDisplacementAmplitude = v;
      },
    },
    roughness: {
      value: ref.current.uRoughness,
      min: 0,
      max: 1,
      onChange: (v) => {
        ref.current.uRoughness = v;
      },
    },
    clearcoat: {
      value: ref.current.uClearcoat,
      min: 0,
      max: 5,
      onChange: (v) => {
        ref.current.uClearcoat = v;
      },
    },
    cc_roughness: {
      value: ref.current.uClearcoatRoughness,
      min: 0,
      max: 1,
      onChange: (v) => {
        ref.current.uClearcoatRoughness = v;
      },
    },
    iridescence: {
      value: ref.current.uIridescence,
      min: 0,
      max: 5,
      onChange: (v) => {
        ref.current.uIridescence = v;
      },
    },
  });

  return ref;
}

function getRandomInt(min: number, max: number, seed?: number) {
  return Math.floor(MathUtils.seededRandom(seed) * (max - min + 1)) + min;
}
function getRandomFloat(min: number, max: number, seed?: number) {
  return MathUtils.seededRandom(seed) * (max - min) + min;
}

function generateRandomParameters(uSeed: number): ShaderControls {
  return {
    uSeed,
    uColor1: new Color(),
    uColor2: new Color(),
    uUseColorKey: getRandomInt(...VALID_RANGES.use_key, uSeed),
    uColorKeyValue: getRandomInt(...VALID_RANGES.key_value, uSeed),
    uColorNoiseScale: getRandomFloat(...VALID_RANGES.color_noise, uSeed),
    uDisplacementNoiseScale: getRandomFloat(
      ...VALID_RANGES.displacement_noise,
      uSeed
    ),
    uDisplacementAmplitude: getRandomFloat(...VALID_RANGES.amplitude, uSeed),
    uRoughness: getRandomFloat(...VALID_RANGES.roughness, uSeed),
    uClearcoat: getRandomFloat(...VALID_RANGES.clearcoat, uSeed),
    uClearcoatRoughness: getRandomFloat(...VALID_RANGES.cc_roughness, uSeed),
    uIridescence: getRandomFloat(...VALID_RANGES.iridescence, uSeed),
  };
}

const VALID_RANGES: Record<string, [number, number]> = {
  use_key: [0, 1],
  key_value: [0, 1],
  color_noise: [0.5, 20],
  displacement_noise: [0.01, 2],
  amplitude: [0.01, 0.5],
  roughness: [0, 1],
  clearcoat: [0, 5],
  cc_roughness: [0, 1],
  iridescence: [0, 5],
};
