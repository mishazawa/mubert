import type { RandomGenerator } from "../utils";
import { formatHex } from "culori";
import { Poline, positionFunctions, type PositionFunction } from "poline";
import { useMemo } from "react";
import { Color } from "three";
import { palettes } from "../palettes";

const POSITION_FUNCTIONS = Object.values(positionFunctions);

const typedTuple = <T extends unknown[]>(...args: T): T => args;

export function useColorGenerator(rand: RandomGenerator, seed: number) {


  
  const keys = Object.keys(palettes);
  const randomKey = keys[Math.floor(rand.float(0, 1) * keys.length)];
  
  const key_ = window.customImage.split('.')[0].split('/').pop() || randomKey;

  const cpal = palettes[key_];
  
  return cpal.map((c) => new Color(c).toArray());


  const posFunctions = pickRandomFns(rand);



  const rv = rand.float(0, 1);
  const hue1 = rv * 360;
  const hue2 = (rv + 0.5) * 360;

  const palette = useMemo(
    () =>
      new Poline({
        anchorColors: [
          typedTuple(hue1, rand.float(0.0, 1.0), rand.float(0.0, 1.0)),
          typedTuple(hue2, rand.float(1.0, 1.0), rand.float(1.0, 1.0)),
          typedTuple(hue1, rand.float(1.0, 1.0), rand.float(1.0, 1.0)),
        ],
        numPoints: 5,
        ...posFunctions,
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

function pickRandomFns(rand: RandomGenerator) {
  const pftns_use: PositionFunction[] = [];
  for (let i = 0; i < 3; i++) {
    pftns_use.push(
      POSITION_FUNCTIONS[rand.int(0, POSITION_FUNCTIONS.length - 1)]
    );
  }
  return {
    positionFunctionX: pftns_use[0],
    positionFunctionY: pftns_use[1],
    positionFunctionZ: pftns_use[2],
  };
}
