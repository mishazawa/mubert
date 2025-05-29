import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color } from "three";
import shaderVert from "@/app/shader/vertex.glsl";
import shaderFrag from "@/app/shader/fragment.glsl";

export const ColorShiftMaterial = shaderMaterial(
  { time: 0, color: new Color(0.2, 0.0, 0.1) },
  // vertex shader
  shaderVert,
  // fragment shader
  shaderFrag
);

// declaratively
extend({ ColorShiftMaterial });
