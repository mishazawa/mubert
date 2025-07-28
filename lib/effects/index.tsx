import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  SMAA,
} from "@react-three/postprocessing";

import { useParameters } from "../hooks/useParameters";
import { AO } from "./N8AO";
import {
  DOF_BOKEH_SCALE,
  DOF_FOCUS_LENGTH,
  FX_NOISE_SCALE,
} from "../constants";
import { AudioReactiveGlitch } from "./AudioReactiveGlitch";

export function FX() {
  const ctx = useParameters();

  return !ctx.debug.postfx ? null : (
    <EffectComposer multisampling={0}>
      <DepthOfField
        target={[0, 0, 0]}
        focalLength={DOF_FOCUS_LENGTH}
        bokehScale={DOF_BOKEH_SCALE}
      />
      <AO />
      <AudioReactiveGlitch />

      <Noise opacity={FX_NOISE_SCALE} />
      <Bloom mipmapBlur levels={7} intensity={1} />
      <SMAA />
    </EffectComposer>
  );
}
