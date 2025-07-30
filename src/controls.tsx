import { LIGHT_PRESET } from "@lib/components/light/presets";
import { generateShaderParams } from "@lib/main";
import type { ShaderControls } from "@lib/shaders/types";

import { randomGenerator } from "@lib/utils";
import { button, useControls } from "leva";
import { useMemo, useState } from "react";

export function useShaderState(): [ShaderControls, any] {
  const rng = useMemo(() => randomGenerator(666), []);

  const [defaults, set] = useState(generateShaderParams(rng.int(0, 1024)));

  useControls(
    {
      Generate: button(() => {
        const params = generateShaderParams(rng.int(0, 9999));
        set(params);
      }),
    },
    [defaults.uSeed]
  );
  useControls({
    seed: {
      step: 1,
      value: defaults.uSeed,
      onChange: (v) => {
        set({ ...defaults, uSeed: v });
      },
    },
  });

  const [debug] = useControls(
    "Debug",
    () => ({
      postfx: true,
      vertex: false,
      fragment: false,
      stopCamera: false,
      stopObject: false,
      pointSize: {
        value: 0.05,
        min: 0.01,
        max: 1,
      },
      light: {
        value: 0,
        min: 0,
        max: LIGHT_PRESET.length - 1,
        step: 1,
      },
      lightAccent: {
        value: 0,
        min: 0,
        max: 4,
        step: 1,
      },
      dofOffset: {
        value: 0,
        min: -1,
        max: 1,
      },
    }),
    { collapsed: true }
  );

  const [ao] = useControls(
    "AO",
    () => ({
      aoRadius: 5,
      aoSamples: { value: 16, step: 1 },
      denoiseSamples: { value: 4, step: 1 },
      denoiseRadius: { value: 12, step: 1 },
      distanceFalloff: 1,
      intensity: 1,

      quality: { options: ["performance", "low", "medium", "high", "ultra"] },

      color: `#000`,
      halfRes: true,
      depthAwareUpsampling: false,
      screenSpaceRadius: true,
      renderMode: { step: 1, min: 0, max: 4, value: 0 },
    }),
    { collapsed: true }
  );

  return [
    {
      ...defaults,
    },
    {
      ...debug,
      ao,
    },
  ];
}
