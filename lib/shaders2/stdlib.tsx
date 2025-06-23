import simplex3d from "./utils/simplex3d.glsl?raw";
import voronoi3d from "./utils/voronoi3d.glsl?raw";
import math from "./utils/math.glsl?raw";
import random from "./utils/random.glsl?raw";
import calcNormal from "./utils/calc_normal.glsl?raw";
import lineFunctions from "./utils/line_functions.glsl?raw";
import noiseDistortion from "./utils/noise_distortion.glsl?raw";

const INCLUDE_MAP = {
  "//#include<calc_normal>": calcNormal,
  "//#include<noise3>": simplex3d,
  "//#include<voronoi3>": voronoi3d,
  "//#include<math>": math,
  "//#include<random>": random,
  "//#include<line_functions>": lineFunctions,
  "//#include<noise_distortion>": noiseDistortion,
};

export function includeStdLib(raw: string) {
  let copy = `${raw}`;

  Object.entries(INCLUDE_MAP).forEach(([key, value]) => {
    copy = copy.replace(key, value);
  });

  return copy;
}
