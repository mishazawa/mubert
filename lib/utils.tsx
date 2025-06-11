import { MathUtils } from "three";
import colors from "nice-color-palettes";

export function getColors(rg: RandomGenerator) {
  const palette = colors[rg.int(0, 100)];
  const primary = palette[0];
  const secondary = palette[rg.int(1, palette.length - 1)];
  return [primary, secondary];
}

function getRandomInt(min: number, max: number, seed?: number) {
  return Math.floor(MathUtils.seededRandom(seed) * (max - min + 1)) + min;
}
function getRandomFloat(min: number, max: number, seed?: number) {
  return MathUtils.seededRandom(seed) * (max - min) + min;
}

export function randomSwapRange(
  [a, b]: number[],
  value: number
): [number, number] {
  return value >= 0.5 ? [a, b] : [b, a];
}

type RandomGenerator = {
  int: (min: number, max: number) => number;
  float: (min: number, max: number) => number;
};

export function randomGenerator(seed: number): RandomGenerator {
  let counter = 0;
  return {
    int(min: number, max: number) {
      counter++;
      return getRandomInt(min, max, seed + counter);
    },
    float(min: number, max: number) {
      counter++;
      return getRandomFloat(min, max, seed + counter);
    },
  };
}
