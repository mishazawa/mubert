import { type RandomGenerator } from "../utils";
import { Color } from "three";
import { PALETTES } from "../palettes";
import { useMemo } from "react";
import type { PropsPalette } from "../types";

export function useColorGenerator(
  rand: RandomGenerator,
  seed: number,
  palette?: PropsPalette
) {
  const randomColor = useMemo(
    () => palette ?? PALETTES[Math.floor(rand.float(0, 1) * PALETTES.length)],
    [seed]
  );

  return randomColor.map((c) => new Color(c).toArray());
}
