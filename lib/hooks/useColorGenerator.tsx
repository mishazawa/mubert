import type { RandomGenerator } from "../utils";
import { formatHex } from "culori";
import { Poline, positionFunctions } from "poline";
import { useMemo } from "react";
import { Color } from "three";

const typedTuple = <T extends unknown[]>(...args: T): T => args;

export function useColorGenerator(rand: RandomGenerator, seed: number) {
  const palette = useMemo(
    () =>
      new Poline({
        anchorColors: [
          typedTuple(rand.int(0, 360), rand.float(1, 1), rand.float(0.5, 1)),
          typedTuple(rand.int(-360, 360), rand.float(1, 1), 1),
          typedTuple(rand.int(0, 360), rand.float(1, 1), rand.float(0.5, 1)),
        ],
        numPoints: 5,
        positionFunctionX: positionFunctions["sinusoidalPosition"],
        positionFunctionY: positionFunctions["quadraticPosition"],
        positionFunctionZ: positionFunctions["linearPosition"],
      }),
    [seed]
  );

  return [...palette.colors]
    .map((c) =>
      formatHex({
        mode: "okhsl",
        h: c[0],
        s: c[1],
        l: c[2],
      })
    )
    .map((c) => new Color(c).toArray());
}
