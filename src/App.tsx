import { useRef } from "react";
import Canvas, { generateShaderParams } from "@lib/main";
import { button, useControls } from "leva";

import { Color } from "three";

function App() {
  const data = useShaderState();
  return <Canvas data={data} />;
}

export default App;

const MAX_SEED = 2048;

function useShaderState() {
  const ref = useRef(generateShaderParams(0));
  const options = useUiParams(ref);
  useControls(options as any);

  return ref;
}

function useUiParams(ref: any) {
  // for demo purpose show only generate button
  if (process.env.NODE_ENV !== "development")
    return {
      Generate: button(() => {
        const seed = Math.random() * MAX_SEED;
        console.log(seed);
        ref.current = generateShaderParams(seed);
      }),
    };

  return {
    seed: {
      value: ref.current.uSeed,
      step: 1,
      onChange: (v: any) => {
        ref.current.uSeed = v;
      },
    },
    primary: {
      value: `#${ref.current.uColor1.getHexString()}`,
      onChange: (v: any) => {
        ref.current.uColor1 = new Color(v);
      },
    },
    secondary: {
      value: `#${ref.current.uColor2.getHexString()}`,
      onChange: (v: any) => {
        ref.current.uColor2 = new Color(v);
      },
    },
    use_key: {
      value: ref.current.uUseColorKey,
      min: 0,
      max: 1,
      step: 1,
      onChange: (v: any) => {
        ref.current.uUseColorKey = v;
      },
    },
    key_value: {
      value: ref.current.uColorKeyValue,
      min: 0,
      max: 1,
      step: 1,
      onChange: (v: any) => {
        ref.current.uColorKeyValue = v;
      },
    },
    color_noise: {
      value: ref.current.uColorNoiseScale,
      min: 0.5,
      max: 20,
      onChange: (v: any) => {
        ref.current.uColorNoiseScale = v;
      },
    },
    displacement_noise: {
      value: ref.current.uDisplacementNoiseScale,
      min: 0.01,
      max: 2,
      onChange: (v: any) => {
        ref.current.uDisplacementNoiseScale = v;
      },
    },
    amplitude: {
      value: ref.current.uDisplacementAmplitude,
      min: 0.01,
      max: 0.5,
      onChange: (v: any) => {
        ref.current.uDisplacementAmplitude = v;
      },
    },
    roughness: {
      value: ref.current.uRoughness,
      min: 0,
      max: 1,
      onChange: (v: any) => {
        ref.current.uRoughness = v;
      },
    },
    clearcoat: {
      value: ref.current.uClearcoat,
      min: 0,
      max: 5,
      onChange: (v: any) => {
        ref.current.uClearcoat = v;
      },
    },
    cc_roughness: {
      value: ref.current.uClearcoatRoughness,
      min: 0,
      max: 1,
      onChange: (v: any) => {
        ref.current.uClearcoatRoughness = v;
      },
    },
    iridescence: {
      value: ref.current.uIridescence,
      min: 0,
      max: 5,
      onChange: (v: any) => {
        ref.current.uIridescence = v;
      },
    },
  };
}
