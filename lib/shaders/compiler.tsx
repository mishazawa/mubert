import simplex3d from "./utils/simplex3d.glsl?raw";
import simplex4d from "./utils/simplex4d.glsl?raw";

import vertex from "./vertex.glsl?raw";
import noiseVert from "./vertex_noise.glsl?raw";
import noiseFrag from "./fragment_noise.glsl?raw";

import organicFrag from "./organic_fragment.glsl?raw";

type ShaderKey = "noise" | "organic";

const META_MAP: Record<ShaderKey, [string, string]> = {
  noise: [noiseVert, noiseFrag],
  organic: [vertex, organicFrag],
};

const INCLUDE_MAP = {
  "//#include<snoise>": simplex4d,
  "//#include<noise3>": simplex3d,
};

/**
 * //#include\<snoise> -> simplex4d
 *
 * //#include\<noise3> -> simplex3d
 *
 * @param raw Shader as string
 * @returns compiled string
 */
export function compile(key: ShaderKey) {
  return [
    compileShader(META_MAP[key][0], INCLUDE_MAP),
    compileShader(META_MAP[key][1], INCLUDE_MAP),
  ];
}

function compileShader(raw: string, map: Record<string, string>) {
  let copy = `${raw}`;

  Object.entries(map).forEach(([key, value]) => {
    copy = copy.replace(key, value);
  });
  return copy;
}
