import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useParameters } from "./useParameters";
import type { GenerativeShaderUniforms, UniformValue } from "../shaders/types";
import { assignUniforms, generateDefaults } from "../shaders/uniforms";
import { useAudioTexture } from "../components/hooks";
import { useFrame } from "@react-three/fiber";
import { SPEED_MULTIPLIER } from "../constants";
import { Vector3 } from "three";

function useAnimatedUniforms(uniforms: RefObject<GenerativeShaderUniforms>) {
  const audioTex = useAudioTexture();
  const ctx = useParameters();

  useEffect(() => {
    (uniforms.current.uAudioTex.value as any) = audioTex;
  }, [audioTex]);

  const speedControls = ctx.debug.speed ?? 1;

  // animate uniforms here
  useFrame(() => {
    let [rms] = ctx.getRMS();
    rms = Math.pow(rms * 2.0, 2.0);
    // rms = rms / ((window.fft_max ?? 255)/255);

    const pastRms = uniforms.current.uRMS.value;

    const mix_min = ctx.fft.current.mix_min ?? 0.4;
    const mix_max = ctx.fft.current.mix_max ?? 0.99;

    const newRms =
      pastRms < 0
        ? pastRms * (1.0 - mix_max) + rms * mix_max
        : pastRms * (1.0 - mix_min) + rms * mix_min;

    uniforms.current.uRMS.value = ctx.fft.current.val = newRms;
    uniforms.current.uFFT.value = ctx.getFFT();

    (uniforms.current.uTime as UniformValue<number>).value +=
      SPEED_MULTIPLIER * speedControls * rms * 10.0;
    ctx.fft.current.time = uniforms.current.uTime.value;
  });
}

const UniformsContext =
  createContext<RefObject<GenerativeShaderUniforms> | null>(null);

export const UniformsProvider = ({ children }: { children: ReactNode }) => {
  const ctx = useParameters();

  const uniforms = useRef<GenerativeShaderUniforms>(generateDefaults());

  useEffect(() => {
    assignUniforms(uniforms.current, ctx.data);

    uniforms.current.uColor1.value = ctv(ctx.palette[0]);
    uniforms.current.uColor2.value = ctv(ctx.palette[1]);
    uniforms.current.uColor3.value = ctv(ctx.palette[2]);
    uniforms.current.uColor4.value = ctv(ctx.palette[3]);
    uniforms.current.uColor5.value = ctv(ctx.palette[4]);
  }, [ctx.data]);

  useAnimatedUniforms(uniforms);

  return (
    <UniformsContext.Provider value={uniforms}>
      {children}
    </UniformsContext.Provider>
  );
};

export const useSharedUniforms = () => {
  const context = useContext(UniformsContext);
  if (!context)
    throw new Error("useSharedUniforms must be used within UniformsProvider");
  return context;
};
function ctv(arg0: number[]): Vector3 {
  return new Vector3(...arg0);
}
