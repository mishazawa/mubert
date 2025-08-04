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
  FX_NOISE_SCALE,
} from "../constants";
import { AudioReactiveGlitch } from "./AudioReactiveGlitch";
import { useDebug } from "../hooks/useDebug";
import { useParameters } from "@lib/hooks/useParameters";

export function FX() {
  const ctx = useParameters();
  const postfx = useDebug("postfx", true);
  const dofOffset = useDebug("dofOffset", DOF_OFFSET);

  if (!postfx) return null;

  // show simplified fx for mobile device
  if (ctx.isMobile)
    return (
      <EffectComposer multisampling={0}>
        <AudioReactiveGlitch />
        <Bloom mipmapBlur levels={7} intensity={0.5} />
        <SMAA />
      </EffectComposer>
    );

  return (
    <EffectComposer multisampling={0}>
      <DepthOfField
        target={[0, 0, dofOffset]}
        focalLength={DOF_FOCUS_LENGTH}
        bokehScale={DOF_BOKEH_SCALE}
      />
      <AO />
      <AudioReactiveGlitch />

      <Noise opacity={FX_NOISE_SCALE} />
      <Bloom mipmapBlur levels={7} intensity={0.5} />
      <SMAA />
    </EffectComposer>
  );
}
