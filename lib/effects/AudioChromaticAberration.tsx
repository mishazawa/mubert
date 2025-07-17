import { useFrame } from "@react-three/fiber";
import { useParameters } from "../components/hooks";

import { ChromaticAberrationEffect } from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import { Vector2 } from "three";
import { useGlitchThreshold } from "./AudioGlitch";

export function AudioChromaticAberration({
  offset = new Vector2(1e-3, 5e-4),
  radialModulation = false,
  modulationOffset = 0.15,
}: {
  offset?: Vector2;
  radialModulation?: boolean;
  modulationOffset?: number;
}) {
  const ref = useRef(null!);
  const ctx = useParameters();
  const effect = useMemo(
    () =>
      new ChromaticAberrationEffect({
        offset,
        radialModulation,
        modulationOffset,
      }),
    []
  );
  const isGlitchActive = useGlitchThreshold();

  useFrame(() => {
    const [r] = ctx.getRMS();

    const thresh = +isGlitchActive();
    effect.offset
      .set(r, -r)
      .multiplyScalar(ctx.debug.chromaticAberration * thresh);
  });

  useEffect(() => {
    return () => {
      effect.dispose?.();
    };
  }, [effect]);

  return <primitive ref={ref} object={effect} dispose={null} />;
}
