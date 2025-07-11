import { generateShaderParams } from "@lib/main";
import type { ShaderPreset } from "@lib/shaders/presets";
import type { ShaderControls } from "@lib/shaders/types";

import { randomGenerator } from "@lib/utils";
import { button, useControls } from "leva";
import { useEffect, useMemo, useState } from "react";
import { Color } from "three";

const PRESETS: ShaderPreset[] = [
  "noop",
  "stripes",
  "slai",
  "pnoise",
  "linoise",
];

export function useShaderState(): [ShaderControls, any] {
  const rng = useMemo(() => randomGenerator(666), []);
  const presets = useMemo(
    (): ShaderPreset[] => [
      "slai",
      "slai",
      "slai",
      "slai",
      "slai",
      "slai",
      "slai",
      // "stripes",
      // "stripes",
      // "stripes",
      // "linoise",
      // "pnoise",
    ],
    []
  );

  const [defaults, set] = useState(generateShaderParams(rng.int(0, 1024)));

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
        const params = generateShaderParams(rng.int(0, 9999));
        set(params);
        setData({ uSeed: params.uSeed });
        setPreset({
          preset: presets[rng.int(0, presets.length)],
          style: rng.casino(0.7),
        });
      }),
    },
    [defaults.uSeed]
  );

  const [debug, setPreset] = useControls(
    "Presets",
    () => ({
      preset: {
        value: "slai",
        options: PRESETS,
      },
      style: {
        value: 0,
        min: 0,
        max: 3,
        step: 1,
      },
      mesh: {
        value: 2,
        min: 0,
        max: 3,
        step: 1,
      },
      pointSize: {
        value: 0.05,
        min: 0.01,
        max: 1,
      },
      lens: {
        value: 45,
        min: 1,
        max: 90,
        step: 1,
      },
      distance: {
        value: 5,
        min: 2,
        max: 15,
        step: 0.1,
      },
      vertex: {
        value: false,
      },
      fragment: {
        value: false,
      },
    }),
    { collapsed: true }
  );

  const [data, setData] = useControls(
    "Parameters",
    () => ({
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
    }),
    { collapsed: true }
  );
  const colors = useColorsControls(defaults);

  return [
    {
      ...defaults,
      ...data,
      ...colors,
    },
    debug,
  ];
}

function useColorsControls(defaults: ShaderControls) {
  const [color1, setColor1] = useState<Color>(defaults.uColor1 as Color);
  const [color2, setColor2] = useState<Color>(defaults.uColor2 as Color);
  const [color3, setColor3] = useState<Color>(defaults.uColor3 as Color);
  const [color4, setColor4] = useState<Color>(defaults.uColor4 as Color);
  const [color5, setColor5] = useState<Color>(defaults.uColor5 as Color);

  useEffect(() => {
    setData({
      uColor1: `#${(defaults.uColor1 as Color).getHexString()}`,
      uColor2: `#${(defaults.uColor2 as Color).getHexString()}`,
      uColor3: `#${(defaults.uColor3 as Color).getHexString()}`,
      uColor4: `#${(defaults.uColor4 as Color).getHexString()}`,
      uColor5: `#${(defaults.uColor5 as Color).getHexString()}`,
    });
  }, [defaults.uSeed]);

  const [_, setData] = useControls(
    "Colors",
    () => ({
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
    }),
    { collapsed: true }
  );

  return {
    uColor1: color1,
    uColor2: color2,
    uColor3: color3,
    uColor4: color4,
    uColor5: color5,
  };
}
