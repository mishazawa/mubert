import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

import shaderVertTest from "@/app/shader/vertex_test.glsl";
import shaderFragTest from "@/app/shader/fragment_test.glsl";

export const GenerativeShaderMaterial = shaderMaterial(
  // uniforms
  {},
  // vertex shader
  shaderVertTest,
  // fragment shader
  shaderFragTest
);

// declaratively
extend({ GenerativeShaderMaterial });
