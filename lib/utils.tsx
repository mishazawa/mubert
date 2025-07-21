import { MathUtils, Vector3 } from "three";

export function getVector3(rg: RandomGenerator) {
  return new Vector3(rg.float(0, 1), rg.float(0, 1), rg.float(0, 1));
}
function getRandomInt(min: number, max: number, seed?: number) {
  return Math.floor(MathUtils.seededRandom(seed) * (max - min)) + min;
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

export type RandomGenerator = {
  int: (min: number, max: number) => number;
  float: (min: number, max: number) => number;
  casino: (thresh: number) => 0 | 1;
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
    casino: function (thresh: number): 0 | 1 {
      counter++;
      return getRandomFloat(0, 1, seed + counter) > thresh ? 1 : 0;
    },
  };
}
