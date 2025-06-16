import simplex3d from "./utils/simplex3d.glsl?raw";

import voronoi3d from "./utils/voronoi3d.glsl?raw";

import math from "./utils/math.glsl?raw";
import random from "./utils/random.glsl?raw";
import calcBumpMap from "./utils/calc_bump.glsl?raw";
import lineFunctions from "./utils/line_functions.glsl?raw";

import commonUniforms from "./common/uniforms.glsl?raw";
import commonStandardProps from "./common/standard_props.glsl?raw";

import debugv from "./debug/vertex.glsl?raw";
import debugf from "./debug/fragment.glsl?raw";

import slaiv from "./slai/vertex.glsl?raw";
import slaif from "./slai/fragment.glsl?raw";

import turbulentv from "./turbulent/vertex.glsl?raw";
import turbulentf from "./turbulent/fragment.glsl?raw";

import organicv from "./organic/vertex.glsl?raw";
import organicf from "./organic/fragment.glsl?raw";

import stripesv from "./stripes/vertex.glsl?raw";
import stripesf from "./stripes/fragment.glsl?raw";

type ShaderKey = "noise" | "organic" | "stripes" | "slai";

type DebugShaderValue = "vertex" | "fragment";

export function compile(key: ShaderKey, debug?: DebugShaderValue) {
  return [
    compileShader(
      debug === "vertex" ? debugv : SHADER_BUNDLE[key][0],
      INCLUDE_MAP
    ),
    compileShader(
      debug === "fragment" ? debugf : SHADER_BUNDLE[key][1],
      INCLUDE_MAP
    ),
  ];
}

const SHADER_BUNDLE: Record<ShaderKey, [string, string]> = {
  noise: [turbulentv, turbulentf],
  organic: [organicv, organicf],
  stripes: [stripesv, stripesf],
  slai: [slaiv, slaif],
};

const INCLUDE_MAP = {
  "//#include<common_uniforms>": commonUniforms,
  "//#include<common_standard_props>": commonStandardProps,

  "//#include<noise3>": simplex3d,
  "//#include<voronoi3>": voronoi3d,
  "//#include<math>": math,
  "//#include<calc_bump>": calcBumpMap,
  "//#include<random>": random,
  "//#include<line_functions>": lineFunctions,
};

function compileShader(raw: string, map: Record<string, string>) {
  let copy = `${raw}`;

  Object.entries(map).forEach(([key, value]) => {
    copy = copy.replace(key, value);
  });
  return copy;
}
