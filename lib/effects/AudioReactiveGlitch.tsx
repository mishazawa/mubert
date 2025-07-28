import { forwardRef, useMemo, type RefObject } from "react";
import { Uniform } from "three";
import { Effect } from "postprocessing";

import fragmentShader from "./shaders/glitch.glsl?raw";
import { useSharedUniforms } from "../hooks/useSharedUniforms";
import type { GenerativeShaderUniforms } from "../shaders/types";
import {
  useSharedTextures,
  type SharedTextures,
} from "../hooks/useSharedTextures";

class AudioReactiveGlitchImpl extends Effect {
  sharedUniforms: RefObject<GenerativeShaderUniforms> = null!;
  sharedTextures: SharedTextures = {
    uAudioTex: null!,
    uRefractionTex: null!,
  };
  constructor(
    sharedUniforms: RefObject<GenerativeShaderUniforms>,
    sharedTextures: SharedTextures
  ) {
    const uniforms = new Map<string, Uniform>([
      ["uTime", new Uniform(0)],
      ["uRMS", new Uniform(0)],
      ["uAudioTex", new Uniform(sharedTextures.uAudioTex.current)],
    ]);

    super("AudioReactiveGlitch", fragmentShader, { uniforms });
    this.sharedUniforms = sharedUniforms;
    this.sharedTextures = sharedTextures;
  }

  update() {
    this.uniforms.get("uTime")!.value = this.sharedUniforms.current.uTime.value;
    this.uniforms.get("uRMS")!.value = this.sharedUniforms.current.uRMS.value;
  }
}

// Effect component
export const AudioReactiveGlitch = forwardRef((_props, ref) => {
  const sharedUniforms = useSharedUniforms();
  const sharedTextures = useSharedTextures();
  const effect = useMemo(
    () => new AudioReactiveGlitchImpl(sharedUniforms, sharedTextures),
    [sharedUniforms]
  );
  return <primitive ref={ref} object={effect} dispose={null} />;
});
