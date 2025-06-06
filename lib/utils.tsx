import { MathUtils } from "three";
import colors from "nice-color-palettes";

export function getColors(uSeed: number) {
  const palette = colors[getRandomInt(0, 100, uSeed)];
  const primary = palette[0];
  const secondary = palette[getRandomInt(1, palette.length - 1, uSeed)];
  return [primary, secondary];
}

export function getRandomInt(min: number, max: number, seed?: number) {
  return Math.floor(MathUtils.seededRandom(seed) * (max - min + 1)) + min;
}
export function getRandomFloat(min: number, max: number, seed?: number) {
  return MathUtils.seededRandom(seed) * (max - min) + min;
}

export function randomSwapRange(
  [a, b]: number[],
  seed?: number
): [number, number] {
  return getRandomFloat(0, 1, seed) >= 0.5 ? [a, b] : [b, a];
}
