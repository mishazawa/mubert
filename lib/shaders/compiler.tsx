import simplex3d from "./utils/simplex3d.glsl?raw";
import simplex4d from "./utils/simplex4d.glsl?raw";

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
export function compile(raw: string) {
  return compileShader(raw, INCLUDE_MAP);
}

function compileShader(raw: string, map: Record<string, string>) {
  let copy = `${raw}`;

  Object.entries(map).forEach(([key, value]) => {
    copy = copy.replace(key, value);
  });
  return copy;
}
