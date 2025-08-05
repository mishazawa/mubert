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

export function isMobileUA() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function ctv(arg0: number[]): Vector3 {
  return new Vector3(...arg0);
}

export function debugCheckerData(size: number) {
  // if (!import.meta.env.DEV) return null;

  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const checker = ((x >> 4) + (y >> 4)) & 1;
      const color = checker ? 255 : 0;

      data[i] = color; // R
      data[i + 1] = color; // G
      data[i + 2] = color; // B
      data[i + 3] = 255; // A
    }
  }
  return data;
}
