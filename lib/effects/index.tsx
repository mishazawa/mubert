import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  SMAA,
} from "@react-three/postprocessing";

import { AO } from "./N8AO";
import {
  DOF_BOKEH_SCALE,
  DOF_FOCUS_LENGTH,
  DOF_OFFSET,
  FX_BLOOM_INTENSITY,
  FX_BLOOM_LEVELS,
  FX_BLOOM_LEVELS_MOBILE,
  FX_BLOOM_LUMINANCE_THRESHOLD,
  FX_NOISE_SCALE,
} from "../constants";
import { AudioReactiveGlitch } from "./AudioReactiveGlitch";
import { useDebug } from "../hooks/useDebug";
import { useParameters } from "../hooks/useParameters";

export function FX() {
  const ctx = useParameters();
  const postfx = useDebug("postfx", true);

  if (!postfx) return null;

  // show simplified fx for mobile device
  if (ctx.isMobile)
    return (
      <EffectComposer multisampling={0}>
        <AudioReactiveGlitch />
        <Bloom
          mipmapBlur
          levels={FX_BLOOM_LEVELS_MOBILE}
          intensity={FX_BLOOM_INTENSITY}
          luminanceThreshold={FX_BLOOM_LUMINANCE_THRESHOLD}
        />
        <SMAA />
      </EffectComposer>
    );

  return (
    <EffectComposer multisampling={0}>
      <DepthOfField
        target={[0, 0, DOF_OFFSET]}
        focalLength={DOF_FOCUS_LENGTH}
        bokehScale={DOF_BOKEH_SCALE}
      />
      <AO />
      <AudioReactiveGlitch />

      <Noise opacity={FX_NOISE_SCALE} />
      <Bloom
        mipmapBlur
        levels={FX_BLOOM_LEVELS}
        intensity={FX_BLOOM_INTENSITY}
        luminanceThreshold={FX_BLOOM_LUMINANCE_THRESHOLD}
      />
      <SMAA />
    </EffectComposer>
  );
}
