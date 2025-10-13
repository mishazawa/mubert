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
    mix_min: 0.5,
    mix_max: 0.5,
    max: 0.5
  });

  const { uAudioTex } = useSharedTextures();
  const { uCustomTex } = useCustomTexture();

  useEffect(() => {
    // assign to shader
    (uniforms.current.uAudioTex.value as any) = uAudioTex.current;
  }, []);

  useEffect(() => {
    (uniforms.current.uCustomTex.value as any) = uCustomTex;
  }, [uCustomTex]);

  const speedControls = useDebug("speed", 1);

  // animate uniforms here
  const useTexture = useDebug("useTexture", false);
  const mix_min = useDebug("fft_min", 0.5);
  const mix_max = useDebug("fft_max", 0.5);
  const rms_min = useDebug("rms_min", 0.5);
  const rms_max = useDebug("rms_max", 0.5);
  const rms_speed = useDebug("rms_speed", 0.5);

  useFrame((_, dt) => {
    let rms = ctx.getRMS();
    rms = Math.pow(rms * 2.0, 2.0);
    // rms = rms / ((window.fft_max ?? 255)/255);
    uniforms.current.uUseTex.value = useTexture;
    const pastRms = uniforms.current.uRMS.value;

    const newRms =
      pastRms < rms
        ? pastRms * (1.0 - rms_max) + rms * rms_max
        : pastRms * (1.0 - rms_min) + rms * rms_min;

    uniforms.current.uRMS.value = newRms;
    uniforms.current.uFFT.value = ctx.getFFT();

    // TODO: dt is 0

    (uniforms.current.uTime as UniformValue<number>).value +=
      SPEED_MULTIPLIER * speedControls * rms * rms_speed * 1.0;
  });

  // animate fft texture
  const buffer = uAudioTex.current.image.data as Uint8Array;
  const ROW = uAudioTex.current.image.width;
  console.log("uAudioTex size", uAudioTex.current.image.width, uAudioTex.current.image.height);

  useFrame(() => {
    try {


      // const fft_step = 16;
      // // 1. scroll everything down by fft_step lines (drops last row)
      // buffer.copyWithin(fft_step * ROW, 0, buffer.length - fft_step * ROW);

      // // 2. write new FFT row at the top
      // const fft = ctx.getFFT();
      // // const max_fft = analyser.getRMS();
      // let curr_max = Math.max(...fft);
      // let new_max = curr_max;

      // if (smoothFFT.current.max != undefined) {
      //   let past_max = smoothFFT.current.max;
      //   let fade = 0.99;
      //   new_max = Math.max(curr_max, past_max * fade);
      // }

      // smoothFFT.current.max = new_max;


      // for (let i = 0; i < fft.length; i++) {
      //   let v = fft[i];
      //   v = (v / new_max) * 255;
      //   const idx = i * 4; // row 0 offset

      //   let pv = buffer[idx];
      //   if (pv > v) {
      //     v = pv * (1.0 - mix_min) + v * mix_min; // smooth
      //   } else if (pv < v) {
      //     v = pv * (1.0 - mix_max) + v * mix_max; // smooth
      //   }

      //   buffer[idx] = buffer[idx + 1] = buffer[idx + 2] = v;
      //   buffer[idx + 3] = 255; // alpha
      // }

      // uAudioTex.current.needsUpdate = true;

      // uAudioTex.current.generateMipmaps = true;

      // // // force regeneration of mipmaps manually
      // uAudioTex.current.minFilter = THREE.LinearMipmapLinearFilter;

      // // // if using WebGL2 + DataTexture, manually trigger mipmap gen:
      // // const gl = uAudioTex.current.source?.renderer?.getContext?.();
      // // if (gl && uAudioTex.current.isDataTexture) {
      // //   const textureProperties = uAudioTex.current.source?.renderer?.properties.get(uAudioTex.current);
      // //   if (textureProperties?.__webglTexture) {
      // //     gl.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
      // //     gl.generateMipmap(gl.TEXTURE_2D);
      // //   }
      // // }

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
      const fftRaw = ctx.getFFT();               // Float32Array (0..?)
      let currMax = 0;
      for (let i = 0; i < fftRaw.length; i++) currMax = Math.max(currMax, fftRaw[i]);

      let peak = currMax;
      if (smoothFFT.current.max !== undefined) {
        const fade = 0.99;                       // slower decay -> smoother levels
        peak = Math.max(currMax, smoothFFT.current.max * fade);
      }
      smoothFFT.current.max = peak || 1e-6;

      // 3) Per-bin attack/release EMA (in place -> newRow[])
      const attack = typeof mix_max === "number" ? mix_max : 0.40;  // rise speed
      const release = typeof mix_min === "number" ? mix_min : 0.10; // fall speed

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

    } catch (_) {}
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
  useEffect(() => {
    if (!ctx.hui) return;
    uniforms.current.uHui.value = ctx.hui;

  }, [ctx.hui]);

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
