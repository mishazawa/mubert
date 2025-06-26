import { SPEED_MULTIPLIER, UNIFORM_DEFAULTS } from "../constants";
import type { CanvasProps } from "../types";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  IcosahedronGeometry,
  OctahedronGeometry,
  SphereGeometry,
  TorusKnotGeometry,
  type Mesh,
  type Object3D,
} from "three";

import { HorizontalLinesGeometry } from "./HorizontalLinesGeometry";

import type {
  GenerativeShaderUniforms,
  ShaderControls,
  UniformValue,
} from "../shaders/types";

import {
  DataTexture,
  RGBAFormat,
  UnsignedByteType,
  ClampToEdgeWrapping,
  LinearFilter,
} from "three";

type ElementType = keyof ShaderControls;

export function useGeometry(resolution: number) {
  const sphere = useMemo(
    () => new SphereGeometry(1, resolution, resolution),
    [resolution]
  );

  const octahedron = useMemo(
    () => new OctahedronGeometry(1, resolution),
    [resolution]
  );

  const icosahedron = useMemo(
    () => new IcosahedronGeometry(1, resolution),
    [resolution]
  );

  const edges = useMemo(
    () =>
      new HorizontalLinesGeometry(
        new TorusKnotGeometry(1, 0.25, 300, 32),
        //new SphereGeometry(1, resolution, resolution),
        "x"
      ),
    [resolution]
  );

  return [octahedron, sphere, icosahedron, edges];
}

export function useAudioTexture(analyser: Pick<CanvasProps, "getFFT">) {
  const { texture, buffer, ROW } = useMemo(() => {
    const SIZE = 64;
    const ROW = SIZE * 4; // bytes per row  (RGBA)
    const data = new Uint8Array(SIZE * SIZE * 4);
    const tex = new DataTexture(data, SIZE, SIZE, RGBAFormat, UnsignedByteType);
    tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
    tex.magFilter = tex.minFilter = LinearFilter;
    tex.needsUpdate = true;
    return { texture: tex, buffer: data, ROW };
  }, []);

  useFrame(() => {
    // 1. scroll everything down by one line (drops last row)
    buffer.copyWithin(ROW, 0, buffer.length - ROW);

    // 2. write new FFT row at the top
    const fft = analyser.getFFT(); // 64 values 0-255
    for (let i = 0; i < fft.length; i++) {
      const v = fft[i];
      const idx = i * 4; // row 0 offset
      buffer[idx] = buffer[idx + 1] = buffer[idx + 2] = v;
      buffer[idx + 3] = 255; // alpha
    }

    texture.needsUpdate = true;
  });

  return texture; // DataTexture 64×64
}

export function useUniforms(
  controls: ShaderControls,
  speedControls: number,
  analyser: Pick<CanvasProps, "getFFT" | "getRMS">
): RefObject<GenerativeShaderUniforms> {
  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>(UNIFORM_DEFAULTS);
  useEffect(() => {
    Object.keys(controls).map((k) => {
      const key = k as ElementType;
      uniforms.current[key].value = controls[key];
    });
  }, [controls]);

  const audioTex = useAudioTexture(analyser);
  useEffect(() => {
    (uniforms.current.uAudioTex.value as any) = audioTex; // sampler2D in shader
  }, [audioTex]);

  // animate uniforms here
  useFrame(() => {
    const [rms] = analyser.getRMS();
    const pastRms = (uniforms.current.uRMS as UniformValue<number>).value;
    const mixValIn = 0.8;
    const mixValOut = 0.2;
    let newRms = 0.0;
    newRms =
      newRms > pastRms
        ? pastRms * (1.0 - mixValIn) + rms * mixValIn
        : pastRms * (1.0 - mixValOut) + rms * mixValOut;
    uniforms.current.uRMS.value = newRms;

    uniforms.current.uFFT.value = analyser.getFFT();

    (uniforms.current.uTime as UniformValue<number>).value +=
      SPEED_MULTIPLIER * speedControls * rms * 10.0;
  });

  return uniforms;
}

export function useTransforms(): RefObject<Object3D> {
  const ref = useRef<Mesh>(null!);

  // animate mesh here
  useFrame(() => {
    ref.current.rotation.x += 0.001;
    ref.current.rotation.y += 0.001;
  });

  return ref;
}
