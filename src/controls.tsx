import { LIGHT_PRESET } from "@lib/components/light/presets";

import { randomGenerator } from "@lib/utils";
import { button, useControls } from "leva";
import { useMemo } from "react";

export function useSeed() {
  const rng = useMemo(() => randomGenerator(666), []);

  useControls({
    Generate: button(() => {
      set({ seed: rng.int(0, 9999) });
    }),
  });
  const [{ seed }, set] = useControls(() => ({
    seed: {
      step: 1,
      value: rng.int(0, 9999),
    },
  }));

  return seed;
}

export function useDebugParams(): any {
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

  return {
    ...debug,
    ao,
  };
}
