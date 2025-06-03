import { ShaderMaterial, Uniform } from "three";
import vertexShader from "../shaders/vertex.glsl?raw";
import fragmentShader from "../shaders/blur.frag.glsl?raw";

export class VerticalBlurShader extends ShaderMaterial {
  constructor() {
    super({
      name: "VerticalBlurShader",
      defines: { LABEL: "value" },
      uniforms: { tDiffuse: new Uniform(null), v: new Uniform(1.0 / 512.0) },
      vertexShader,
      fragmentShader,
    });
  }
}
