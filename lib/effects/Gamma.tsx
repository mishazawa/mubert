import { Effect } from "postprocessing";
import { forwardRef, useMemo } from "react";
import GAMMA_SHADER from "./shaders/gamma.glsl?raw";

class GammaCorrectionImpl extends Effect {
  constructor() {
    super("GammaCorrection", GAMMA_SHADER, {});
  }

  update() {}
}

export const Gamma = forwardRef((_props, ref) => {
  const effect = useMemo(() => new GammaCorrectionImpl(), []);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
