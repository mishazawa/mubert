import { POINT_DETAIL_DIVIDER, SPEED_MULTIPLIER } from "../constants";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  BufferGeometry,
  CapsuleGeometry,
  EdgesGeometry,
  IcosahedronGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  PlaneGeometry,
  type Mesh,
  type Object3D,
  Quaternion,
  Box3,
  Vector3,
} from "three";

import type {
  GenerativeShaderUniforms,
  MaterialType,
  UniformValue,
} from "../shaders/types";

import {
  DataTexture,
  RGBAFormat,
  UnsignedByteType,
  ClampToEdgeWrapping,
  LinearFilter,
} from "three";

import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { assignUniforms, generateDefaults } from "../shaders/uniforms";
import { useParameters } from "../hooks/useParameters";

const BYPASS_NORMALS = false;

const _q = new Quaternion();
const _bbox = new Box3();
const _size = new Vector3();
const _axis = new Vector3();

export function useGeometry(
  resolution: number
): Record<MaterialType, BufferGeometry[]> {
  const icosahedron = useMemo(
    () => new IcosahedronGeometry(1, resolution),
    [resolution]
  );
  const icosahedron2 = useMemo(
    () => new IcosahedronGeometry(1, 15),
    [resolution]
  );
  const sphere = useMemo(
    () =>
      new SphereGeometry(
        1,
        resolution / POINT_DETAIL_DIVIDER,
        resolution / POINT_DETAIL_DIVIDER
      ),
    [resolution]
  );
  const pill = useMemo(
    () => new CapsuleGeometry(1, 1, 16, 32, 8),
    [resolution]
  );

  const torusknot = useMemo(
    () => new TorusKnotGeometry(1, 0.25, resolution * 2, resolution / 2),
    []
  );
  const torus = useMemo(
    () => new TorusGeometry(1, 0.25, resolution, resolution),
    []
  );
  const plane = useMemo(
    () => new PlaneGeometry(10, 10, resolution, resolution),
    []
  );
  const torusw = useMemo(
    () => recomputeNormals(new EdgesGeometry(torus, 0.2)),
    [torus, resolution]
  );
  const torusknotw = useMemo(
    () => recomputeNormals(new EdgesGeometry(torusknot, 10.85)),
    [torusknot, resolution]
  );

  return {
    solid: [icosahedron, torus, torusknot, pill, plane],
    point: [icosahedron2, sphere, pill],
    wireframe: [torusw, torusknotw],
  };
}

export function useAudioTexture() {
  const ctx = useParameters();

  const { texture, buffer, ROW } = useMemo(() => {
    const SIZE = 256;
    const ROW = SIZE * 4; // bytes per row  (RGBA)
    const data = new Uint8Array(SIZE * SIZE * 4);
    const tex = new DataTexture(data, SIZE, SIZE, RGBAFormat, UnsignedByteType);
    tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
    tex.magFilter = tex.minFilter = LinearFilter;
    tex.needsUpdate = true;
    return { texture: tex, buffer: data, ROW };
  }, []);

  useFrame(() => {
    try {
      // 1. scroll everything down by one line (drops last row)
      buffer.copyWithin(ROW, 0, buffer.length - ROW);

      // 2. write new FFT row at the top
      const fft = ctx.getFFT(); // 64 values 0-255
      // console.log("FFT", fft);
      // const max_fft = analyser.getRMS();
      let curr_max = Math.max(...fft);
      let new_max = curr_max;

      if (ctx.fft.current.max != undefined) {
        let past_max = ctx.fft.current.max;
        let fade = 0.99;
        new_max = Math.max(curr_max, past_max * fade);
      }

      ctx.fft.current.max = new_max;

      const mix_min = ctx.fft.current.mix_min ?? 0.4;
      const mix_max = ctx.fft.current.mix_max ?? 0.99;

      for (let i = 0; i < fft.length; i++) {
        let v = fft[i];
        v = (v / new_max) * 255;
        const idx = i * 4; // row 0 offset

        let pv = buffer[idx];
        if (pv > v) {
          v = pv * (1.0 - mix_min) + v * mix_min; // smooth
        } else if (pv < v) {
          v = pv * (1.0 - mix_max) + v * mix_max; // smooth
        }

        buffer[idx] = buffer[idx + 1] = buffer[idx + 2] = v;
        buffer[idx + 3] = 255; // alpha
      }

      texture.needsUpdate = true;
    } catch (_) {}
  });

  return texture; // DataTexture 64×64
}

export function useUniforms(): RefObject<GenerativeShaderUniforms> {
  const ctx = useParameters();

  const speedControls = ctx.debug.speed ?? 1;
  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>(generateDefaults());

  useEffect(() => {
    assignUniforms(uniforms.current, ctx.data);
  }, [ctx.data]);

  const audioTex = useAudioTexture();
  useEffect(() => {
    (uniforms.current.uAudioTex.value as any) = audioTex; // sampler2D in shader
  }, [audioTex]);

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

  return uniforms;
}

export function useTransforms(): RefObject<Object3D> {
  const ref = useRef<Mesh>(null!);
  const ctx = useParameters();

  // animate mesh here
  useFrame(() => {
    const fft_val = ctx.fft.current.val;
    const rot_speed = ctx.rot_speed.current;
    const t = ctx.fft.current.time;

    _axis
      .set(Math.sin(t * 2.0), Math.sin(t * 3.0), Math.sin(t * 5.0))
      .normalize(); // Y-axis

    _q.setFromAxisAngle(_axis, fft_val * rot_speed);
    _bbox.setFromObject(ref.current).getSize(_size);

    if (_size.z > 0.1) {
      ref.current.quaternion.multiply(_q);
    }
  });

  return ref;
}

function recomputeNormals(g: BufferGeometry) {
  if (BYPASS_NORMALS) return g;
  const a = mergeVertices(g);
  a.computeVertexNormals();
  return a;
}
