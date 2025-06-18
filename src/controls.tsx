import { generateShaderParams } from "@lib/main";
import type { ShaderControls } from "@lib/types";
import { randomGenerator } from "@lib/utils";
import { button, useControls } from "leva";
import { useEffect, useMemo, useState } from "react";
import { Color } from "three";
const PRESETS = ["noise", "organic", "stripes", "slai"];

export function useShaderStatePublic() {
  const [data, set] = useState(generateShaderParams(0));

  const rng = useMemo(() => randomGenerator(666), []);
  const presets = useMemo(
    () => ["noise", "organic", "stripes", "slai", "slai", "slai", "slai"],
    []
  );

  const [_, setData] = useControls(
    () => ({
      Generate: button(() => {
        const params = generateShaderParams(rng.int(0, 9999));
        set(params);
        setData({ uSeed: params.uSeed });
        setPreset({ preset: presets[rng.int(0, presets.length)] });
      }),
      uSeed: {
        value: data.uSeed,
        step: 1,
        onChange: (v: any) => {
          set(generateShaderParams(v));
        },
      },
    }),
    [data.uSeed]
  );
  const [debug, setPreset] = useControls(
    () => ({
      preset: {
        value: "slai",
        options: PRESETS,
      },
      polygon: {
        value: 16,
        min: 1,
        max: 32,
        step: 1,
      },
      speed: {
        value: 1,
        min: 0.5,
        max: 5,
        step: 0.1,
      },
    }),
    [data.uSeed]
  );
  return { data, debug };
}

export function useDebugShader() {
  return useControls("Debug", {
    vertex: {
      value: false,
    },
    fragment: {
      value: false,
    },
    preset: {
      value: "slai",
      options: PRESETS,
    },
    mesh: {
      value: 2,
      min: 0,
      max: 2,
      step: 1,
    },
    polygon: {
      value: 8,
      min: 1,
      max: 32,
      step: 1,
    },
  });
}

export function useShaderState() {
  const [defaults, set] = useState(generateShaderParams(0));

  useEffect(() => {
    const {
      uColor1,
      uColor2,
      uColor3,
      uColor4,
      uColor5,
      uNoiseOffset,
      ...qux
    } = defaults;
    setData({
      ...qux,
    });
  }, [defaults.uSeed]);

  useControls(
    {
      Generate: button(() => {
        set(generateShaderParams(defaults.uSeed + 1));
      }),
    },
    [defaults.uSeed]
  );

  const [data, setData] = useControls("Parameters", () => ({
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
    uRoughnessPattern: {
      value: defaults.uRoughnessPattern,
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
    uEmission: {
      value: defaults.uEmission,
      min: 0,
      max: 1,
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
    uStripesWidth: {
      value: defaults.uStripesWidth,
      min: 0,
      max: 1,
    },
    uNoiseVariant: {
      value: defaults.uNoiseVariant,
      min: 0,
      max: 1,
    },
  }));
  const colors = useColorsControls(defaults);

  return {
    ...defaults,
    ...data,
    ...colors,
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
