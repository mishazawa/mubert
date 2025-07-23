import { BlendFunction, GlitchEffect, GlitchMode } from "postprocessing";
import {
  forwardRef,
  useMemo,
  useLayoutEffect,
  useEffect,
  type Ref,
} from "react";
import { ReactThreeFiber, useFrame, useThree } from "@react-three/fiber";
import { useVector2 } from "@react-three/postprocessing";
import { useParameters } from "../hooks/useParameters";
import { useSharedTextures } from "../hooks/useSharedTextures";

export type GlitchProps = ConstructorParameters<typeof GlitchEffect>[0] &
  Partial<{
    mode: GlitchMode;
    active: boolean;
    delay: ReactThreeFiber.Vector2;
    duration: ReactThreeFiber.Vector2;
    chromaticAberrationOffset: ReactThreeFiber.Vector2;
    strength: ReactThreeFiber.Vector2;
  }>;

export const AudioGlitch = /* @__PURE__ */ forwardRef<
  GlitchEffect,
  GlitchProps
>(function Glitch(
  { active = true, ...props }: GlitchProps,
  ref: Ref<GlitchEffect>
) {
  const ctx = useParameters();
  const invalidate = useThree((state) => state.invalidate);
  const delay = useVector2(props, "delay");
  const duration = useVector2(props, "duration");
  const strength = useVector2(props, "strength");

  const isGlitchActive = useGlitchThreshold();

  const { uAudioTex } = useSharedTextures();

  const effect = useMemo(
    () =>
      new GlitchEffect({
        ...props,
        delay,
        duration,
        strength,
        perturbationMap: uAudioTex.current,
        columns: ctx.debug.glitchW,
        blendFunction: BlendFunction.MULTIPLY,
      }),
    [
      delay,
      duration,
      props,
      strength,
      ctx.debug.chromaticAberration,
      ctx.debug.glitchW,
    ]
  );

  useLayoutEffect(() => {
    effect.mode = active
      ? props.mode || GlitchMode.SPORADIC
      : GlitchMode.DISABLED;
    invalidate();
  }, [active, effect, invalidate, props.mode]);

  useEffect(() => {
    return () => {
      effect.dispose?.();
    };
  }, [effect]);

  useFrame(() => {
    if (isGlitchActive()) {
      effect.mode = props.mode || GlitchMode.CONSTANT_WILD;
    } else {
      effect.mode = GlitchMode.DISABLED;
    }
  });

  return <primitive ref={ref} object={effect} dispose={null} />;
});

export function useGlitchThreshold() {
  const ctx = useParameters();

  return () => {
    const a = ctx.getFFT()[ctx.debug.glitchCol || 0];
    return a > ctx.debug.glitch * 255;
  };
}
