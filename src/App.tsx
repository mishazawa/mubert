import { useRef } from "react";
import Canvas from "../lib/main";
import { useControls } from "leva";
import type { ShaderControls } from "../lib/types";
import { Color } from "three";

function App() {
  const data = useShaderState();
  return <Canvas data={data} />;
}

export default App;

const RED = new Color("#f00");

function useShaderState() {
  const ref = useRef<ShaderControls>({
    uSeed: 0,
    uColor1: RED,
    uColor2: RED,
    uUseColorKey: 0,
    uColorKeyValue: 0,
    uColorNoiseScale: 1,
    uDisplacementNoiseScale: 1,
    uDisplacementAmplitude: 1,
    uRoughness: 0,
    uClearcoat: 1,
    uClearcoatRoughness: 0,
    uIridescence: 1,
  });

  useControls({
    seed: {
      value: 0,
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
      value: 0,
      min: 0,
      max: 1,
      step: 1,
      onChange: (v) => {
        ref.current.uUseColorKey = v;
      },
    },
    key_value: {
      value: 1,
      min: 0,
      max: 1,
      step: 1,
      onChange: (v) => {
        ref.current.uColorKeyValue = v;
      },
    },
    color_noise: {
      value: 1,
      min: 0.5,
      max: 20,
      onChange: (v) => {
        ref.current.uColorNoiseScale = v;
      },
    },
    displacement_noise: {
      value: 1,
      min: 0.01,
      max: 2,
      onChange: (v) => {
        ref.current.uDisplacementNoiseScale = v;
      },
    },
    amplitude: {
      value: 1,
      min: 0.01,
      max: 0.5,
      onChange: (v) => {
        ref.current.uDisplacementAmplitude = v;
      },
    },
    roughness: {
      value: 0,
      min: 0,
      max: 1,
      onChange: (v) => {
        ref.current.uRoughness = v;
      },
    },
    clearcoat: {
      value: 1,
      min: 0,
      max: 5,
      onChange: (v) => {
        ref.current.uClearcoat = v;
      },
    },
    cc_roughness: {
      value: 1,
      min: 0,
      max: 1,
      onChange: (v) => {
        ref.current.uClearcoatRoughness = v;
      },
    },
    iridescence: {
      value: 1,
      min: 0,
      max: 5,
      onChange: (v) => {
        ref.current.uIridescence = v;
      },
    },
  });

  return ref;
}
