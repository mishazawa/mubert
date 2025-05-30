import { ShaderMaterial, Uniform } from "three";
import vertexShader from "@/app/shader/fx.vert.glsl";
import fragmentShader from "@/app/shader/blur.frag.glsl";

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
