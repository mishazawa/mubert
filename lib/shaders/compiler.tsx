import simplex3d from "./utils/simplex3d.glsl?raw";

import voronoi3d from "./utils/voronoi3d.glsl?raw";

import math from "./utils/math.glsl?raw";
import random from "./utils/random.glsl?raw";
import calcNormal from "./utils/calc_normal.glsl?raw";
import lineFunctions from "./utils/line_functions.glsl?raw";
import noiseDistortion from "./utils/noise_distortion.glsl?raw";

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

import pnoisev from "./pnoise/vertex.glsl?raw";
import pnoisef from "./pnoise/fragment.glsl?raw";

import linoisev from "./linoise/vertex.glsl?raw";
import linoisef from "./linoise/fragment.glsl?raw";

export type ShaderKey =
  | "noise"
  | "organic"
  | "stripes"
  | "slai"
  | "pnoise"
  | "linoise";

export type MaterialType = "solid" | "point" | "edges";

type DebugShaderValue = "vertex" | "fragment";

const POINTS_PRESETS = ["pnoise"];
const EDGES_PRESETS = ["linoise"];

export function compile(
  key: ShaderKey,
  debug?: DebugShaderValue
): [string, string, MaterialType] {
  return [
    compileShader(
      debug === "vertex" ? debugv : SHADER_BUNDLE[key][0],
      INCLUDE_MAP
    ),
    compileShader(
      debug === "fragment" ? debugf : SHADER_BUNDLE[key][1],
      INCLUDE_MAP
    ),
    getMaterialType(key),
  ];
}

const SHADER_BUNDLE: Record<ShaderKey, [string, string]> = {
  noise: [turbulentv, turbulentf],
  organic: [organicv, organicf],
  stripes: [stripesv, stripesf],
  slai: [slaiv, slaif],
  pnoise: [pnoisev, pnoisef],
  linoise: [linoisev, linoisef],
};

const INCLUDE_MAP = {
  "//#include<common_uniforms>": commonUniforms,
  "//#include<common_standard_props>": commonStandardProps,
  "//#include<calc_normal>": calcNormal,
  "//#include<noise3>": simplex3d,
  "//#include<voronoi3>": voronoi3d,
  "//#include<math>": math,

  "//#include<random>": random,
  "//#include<line_functions>": lineFunctions,
  "//#include<noise_distortion>": noiseDistortion,
};

function compileShader(raw: string, map: Record<string, string>) {
  let copy = `${raw}`;

  Object.entries(map).forEach(([key, value]) => {
    copy = copy.replace(key, value);
  });
  return copy;
}

function getMaterialType(key: ShaderKey): MaterialType {
  if (POINTS_PRESETS.includes(key)) return "point";
  if (EDGES_PRESETS.includes(key)) return "edges";
  return "solid";
}
