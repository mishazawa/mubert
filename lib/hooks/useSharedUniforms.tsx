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
import { useFrame } from "@react-three/fiber";
import { SPEED_MULTIPLIER } from "../constants";

import { useSharedTextures, useCustomTexture } from "./useSharedTextures";
import { useDebug } from "./useDebug";
import { ctv } from "../utils";
import { useUniformObjectMatrix } from "./useTransformsReactive";

import * as THREE from "three";

function useAnimatedUniforms(uniforms: RefObject<GenerativeShaderUniforms>) {
  const ctx = useParameters();

  const smoothFFT = useRef({
    attack: ctx.smoothFFT![0],
    release: ctx.smoothFFT![1],
    max: 0.5,
  });

  const smoothRMS = useRef({
    attack: ctx.smoothRMS![0],
    release: ctx.smoothRMS![1],
    speed: ctx.rmsSpeed!,
  });

  const { uAudioTex } = useSharedTextures();
  const { uCustomTex } = useCustomTexture();

  useEffect(() => {
    // assign to shader
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (uniforms.current.uAudioTex.value as any) = uAudioTex.current;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (uniforms.current.uCustomTex.value as any) = uCustomTex;
  }, [uCustomTex]);

  const speedControls = useDebug("speed", 1);

  // animate uniforms here
  const useTexture = useDebug("useTexture", false);

  useFrame(() => {
    let rms = ctx.getRMS();
    rms = Math.pow(rms * 2.0, 2.0);
    // rms = rms / ((window.fft_max ?? 255)/255);
    uniforms.current.uUseTex.value = useTexture;
    const pastRms = uniforms.current.uRMS.value;

    const attack = smoothRMS.current.attack;
    const release = smoothRMS.current.release;

    const newRms =
      pastRms < rms
        ? pastRms * (1.0 - release) + rms * release
        : pastRms * (1.0 - attack) + rms * attack;

    uniforms.current.uRMS.value = newRms;
    uniforms.current.uFFT.value = ctx.getFFT();

    (uniforms.current.uTime as UniformValue<number>).value +=
      SPEED_MULTIPLIER * speedControls * rms * smoothRMS.current.speed * 1.0;
  });

  // animate fft texture
  const buffer = uAudioTex.current.image.data as Uint8Array;
  const ROW = uAudioTex.current.image.width;
  console.log(
    "uAudioTex size",
    uAudioTex.current.image.width,
    uAudioTex.current.image.height
  );

  useFrame(() => {
    try {
      // Assumptions:
      // - buffer is a Uint8ClampedArray RGBA framebuffer laid out row-major
      // - ROW = width * 4 (bytes per row)
      // - width === fft.length, i.e., one pixel per FFT bin (adjust if different)

      const fft_step = 16;
      const fft = ctx.getFFT();

      // 0) Cache previous top row (row 0) BEFORE scrolling
      const prevTop = new Uint8Array(fft.length);
      for (let i = 0; i < fft.length; i++) {
        prevTop[i] = buffer[i * 4]; // take R (grayscale anyway)
      }

      // 1) Scroll everything down by fft_step rows
      buffer.copyWithin(fft_step * ROW, 0, buffer.length - fft_step * ROW);

      // 2) Normalize new FFT with a decaying peak
      const fftRaw = ctx.getFFT(); // Float32Array (0..?)
      let currMax = 0;
      for (let i = 0; i < fftRaw.length; i++)
        currMax = Math.max(currMax, fftRaw[i]);

      let peak = currMax;
      if (smoothFFT.current.max !== undefined) {
        const fade = 0.99; // slower decay -> smoother levels
        peak = Math.max(currMax, smoothFFT.current.max * fade);
      }
      smoothFFT.current.max = peak || 1e-6;

      // 3) Per-bin attack/release EMA (in place -> newRow[])
      const attack = smoothFFT.current.attack; // rise speed
      const release = smoothFFT.current.release; // fall speed

      const newRow = new Uint8Array(fftRaw.length);
      for (let i = 0; i < fftRaw.length; i++) {
        const target = Math.min(255, (fftRaw[i] / peak) * 255);
        const prev = prevTop[i]; // previous displayed value at the top
        const alpha = target > prev ? attack : release;
        const v = prev + (target - prev) * alpha; // EMA
        newRow[i] = v | 0;
      }

      // 4) Fill the top block with interpolated rows between prevTop -> newRow
      //    Row 0 is closest to newRow; Row (fft_step-1) is closer to prevTop
      //    (you can flip t if you prefer the newest as row 0)
      for (let k = 0; k < fft_step; k++) {
        // t goes 1..(1/fft_step) so row 0 is the newest (strongest) by default
        const t = (fft_step - k) / fft_step; // 1 → 0 across the block
        const rowOffset = k * ROW;

        for (let i = 0; i < newRow.length; i++) {
          // Smoothly interpolate between prevTop and smoothed newRow
          const v = (prevTop[i] * (1 - t) + newRow[i] * t) | 0;
          const idx = rowOffset + i * 4;
          buffer[idx] = buffer[idx + 1] = buffer[idx + 2] = v;
          buffer[idx + 3] = 255;
        }
      }

      uAudioTex.current.needsUpdate = true;

      uAudioTex.current.generateMipmaps = true;

      // // force regeneration of mipmaps manually
      uAudioTex.current.minFilter = THREE.LinearMipmapLinearFilter;

      // console.log("Updated audio texture");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      /* empty */
    }
  });
}

const UniformsContext =
  createContext<RefObject<GenerativeShaderUniforms> | null>(null);

export function UniformsProvider({ children }: { children: ReactNode }) {
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

  // hui: assign prop value to uniform
  // useEffect(() => {
  //   if (!ctx.hui) return;
  //   uniforms.current.uHui.value = ctx.hui;
  // }, [ctx.hui]);

  useAnimatedUniforms(uniforms);
  useUniformObjectMatrix(uniforms);

  return (
    <UniformsContext.Provider value={uniforms}>
      {children}
    </UniformsContext.Provider>
  );
}

export function useSharedUniforms() {
  const context = useContext(UniformsContext);
  if (!context)
    throw new Error("useSharedUniforms must be used within UniformsProvider");
  return context;
}
