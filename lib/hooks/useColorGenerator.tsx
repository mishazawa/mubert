import type { RandomGenerator } from "../utils";
import { formatHex } from "culori";
import { Poline, positionFunctions } from "poline";
import { useMemo } from "react";
import { Color } from "three";


const typedTuple = <T extends unknown[]>(...args: T): T => args;

export function useColorGenerator(rand: RandomGenerator, seed: number) {

  const pfns = [
    positionFunctions["linearPosition"],
    positionFunctions["exponentialPosition"],
    positionFunctions["quadraticPosition"],
    positionFunctions["cubicPosition"],
    positionFunctions["quarticPosition"],
    positionFunctions["sinusoidalPosition"],
    positionFunctions["asinusoidalPosition"],
    positionFunctions["arcPosition"]
  ];
  let pftns_use = [];
  for (let i = 0; i < 3; i++) {
    pftns_use.push(pfns[rand.int(0, pfns.length - 1)]);
  }
  let hue1 = rand.float(0, 1);
  let hue2 = hue1 + 0.5;
  if (rand.float(0, 1) < 0.5) {
    hue2 = hue1 + 0.125;
  }
  hue1 *= 360;
  hue2 *= 360;

  const palette = useMemo(
    () =>
      new Poline({
        anchorColors: [
          typedTuple(hue1, rand.float(0.0, 1.0), rand.float(0.0, 1.0)),
          typedTuple(hue2, rand.float(1.0, 1.0), rand.float(1.0, 1.0)),
          typedTuple(hue1, rand.float(1.0, 1.0), rand.float(1.0, 1.0)),
        ],
        numPoints: 5,
        positionFunctionX: pftns_use[0],
        positionFunctionY: pftns_use[1],
        positionFunctionZ: pftns_use[2],
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
