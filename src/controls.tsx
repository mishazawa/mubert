import { LIGHT_PRESET } from "@lib/components/light/presets";
import { randomGenerator } from "@lib/utils";
import { useTexture } from "@react-three/drei";
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
      value: 817,
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
      controls: false,
      stopObject: false,
      useTexture: true,

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
    }),
    { collapsed: false }
  );

  return {
    ...debug,
  };
}
