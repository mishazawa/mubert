import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  SMAA,
} from "@react-three/postprocessing";

import { useParameters } from "../hooks/useParameters";
import { AudioChromaticAberration } from "./AudioChromaticAberration";
import { AudioGlitch } from "./AudioGlitch";
import { SolidOnlyAO } from "./N8AO";

export function FX() {
  const ctx = useParameters();

  return !ctx.debug.postfx ? null : (
    <EffectComposer multisampling={0}>
      <DepthOfField
        focusDistance={ctx.debug.focusDistance}
        focalLength={ctx.debug.focalLength}
        bokehScale={ctx.debug.bokehScale}
      />
      <SolidOnlyAO />

      <AudioGlitch />
      <AudioChromaticAberration radialModulation />
      <Noise opacity={ctx.debug.noise} />
      <Bloom mipmapBlur levels={7} intensity={1} />
      <SMAA />
    </EffectComposer>
  );
}
