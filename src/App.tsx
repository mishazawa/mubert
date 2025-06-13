import { useEffect, useState } from "react";
import Canvas, { generateShaderParams } from "@lib/main";
import { useControls } from "leva";

import { Color } from "three";
import type { ShaderControls } from "@lib/types";

function App() {
  const data = useShaderState();
  const debug = useDebugShader();
  return <Canvas data={data} debug={debug} />;
}

export default App;

function useShaderState() {
  const [defaults, set] = useState(generateShaderParams(0));

  useEffect(() => {
    const { uColor1, uColor2, uColor3, uColor4, uColor5, ...qux } = defaults;
    setData({
      ...qux,
    });
  }, [defaults.uSeed]);

  const [data, setData] = useControls(() => ({
    uSeed: {
      value: defaults.uSeed,
      step: 1,
      onChange: (v: any) => {
        set(generateShaderParams(v));
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
      max: 0.1,
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
    uLineWidth: {
      value: defaults.uLineWidth,
      min: 0.01,
      max: 1,
    },
    uLineCount: {
      value: defaults.uLineCount,
      step: 1,
      min: 0,
      max: 4,
    },
  }));
  const colors = useColorsControls(defaults);

  return {
    ...data,
    ...colors,
    uSeed: defaults.uSeed,
  };
}

function useColorsControls(defaults: ShaderControls) {
  const [color1, setColor1] = useState(defaults.uColor1);
  const [color2, setColor2] = useState(defaults.uColor2);
  const [color3, setColor3] = useState(defaults.uColor3);
  const [color4, setColor4] = useState(defaults.uColor4);
  const [color5, setColor5] = useState(defaults.uColor5);

  useEffect(() => {
    setData({
      uColor1: `#${defaults.uColor1.getHexString()}`,
      uColor2: `#${defaults.uColor2.getHexString()}`,
      uColor3: `#${defaults.uColor3.getHexString()}`,
      uColor4: `#${defaults.uColor4.getHexString()}`,
      uColor5: `#${defaults.uColor5.getHexString()}`,
    });
  }, [defaults.uSeed]);

  const [_, setData] = useControls("Colors", () => ({
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
    uColor3: {
      value: `#${color3.getHexString()}`,
      onChange: (v: any) => {
        setColor3(new Color(v));
      },
    },
    uColor4: {
      value: `#${color4.getHexString()}`,
      onChange: (v: any) => {
        setColor4(new Color(v));
      },
    },
    uColor5: {
      value: `#${color5.getHexString()}`,
      onChange: (v: any) => {
        setColor5(new Color(v));
      },
    },
  }));

  return {
    uColor1: color1,
    uColor2: color2,
    uColor3: color3,
    uColor4: color4,
    uColor5: color5,
  };
}

function useDebugShader() {
  return useControls("Debug", {
    vertex: {
      value: false,
    },
    fragment: {
      value: false,
    },
    preset: {
      value: "stripes",
      options: ["noise", "organic", "stripes"],
    },
  });
}
