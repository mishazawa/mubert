import { useEffect, useState } from "react";
import Canvas, { generateShaderParams } from "@lib/main";
import { useControls } from "leva";

import { Color } from "three";

function App() {
  const data = useShaderState();
  return <Canvas data={data} />;
}

export default App;

function useShaderState() {
  const [defaults, set] = useState(generateShaderParams(0));

  const [color1, setColor1] = useState(defaults.uColor1);
  const [color2, setColor2] = useState(defaults.uColor2);

  useEffect(() => {
    setData({
      ...defaults,
      uColor1: `#${defaults.uColor1.getHexString()}`,
      uColor2: `#${defaults.uColor2.getHexString()}`,
    });
  }, [defaults.uSeed]);

  const [data, setData] = useControls(() => {
    return {
      uSeed: {
        value: defaults.uSeed,
        step: 1,
        onChange: (v: any) => {
          set(generateShaderParams(v));
        },
      },
      uColor1: {
        value: `#${color1.getHexString()}`,
        onChange: (v: any) => {
          setColor1(new Color(v));
        },
      },
      uColor2: {
        value: `#${color2.getHexString()}`,
        onChange: (v: any) => {
          setColor2(new Color(v));
        },
      },
      uUseColorKey: {
        value: defaults.uUseColorKey,
        min: 0,
        max: 1,
        step: 1,
      },
      uColorKeyValue: {
        value: defaults.uColorKeyValue,
        min: 0,
        max: 1,
        step: 1,
      },
      uColorNoiseScale: {
        value: defaults.uColorNoiseScale,
        min: 0.5,
        max: 20,
      },
      uDisplacementNoiseScale: {
        value: defaults.uDisplacementNoiseScale,
        min: 0.01,
        max: 2,
      },
      uDisplacementAmplitude: {
        value: defaults.uDisplacementAmplitude,
        min: 0.01,
        max: 0.5,
      },
      uRoughness: {
        value: defaults.uRoughness,
        min: 0,
        max: 1,
      },
      uClearcoat: {
        value: defaults.uClearcoat,
        min: 0,
        max: 5,
      },
      uClearcoatRoughness: {
        value: defaults.uClearcoatRoughness,
        min: 0,
        max: 1,
      },
      uIridescence: {
        value: defaults.uIridescence,
        min: 0,
        max: 5,
      },
    };
  });

  return {
    ...data,
    uColor1: color1,
    uColor2: color2,
    uSeed: defaults.uSeed,
  };
}
