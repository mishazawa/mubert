import { SPEED_MULTIPLIER } from "../constants";
import type { CanvasProps } from "../types";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  BufferGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  SphereGeometry,
  TorusKnotGeometry,
  WireframeGeometry,
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

import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { generateDefaults } from "../shaders/uniforms";
import { DipyramidGeometry } from "./Dipyramid";

const BYPASS_NORMALS = false;

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

  const dipyramid = useMemo(
    () => new DipyramidGeometry(4, resolution, 1, 1),
    [resolution]
  );
  const torus = useMemo(() => new TorusKnotGeometry(1, 0.25, 300, 32), []);

  const edgesTorusX = useMemo(
    () => mergeVertices(new HorizontalLinesGeometry(torus, "x")),
    [torus, resolution]
  );
  const edgesTorusY = useMemo(
    () => mergeVertices(new HorizontalLinesGeometry(torus, "y")),
    [torus, resolution]
  );
  const edgesSphereX = useMemo(
    () => mergeVertices(new HorizontalLinesGeometry(sphere, "x")),
    [torus, resolution]
  );
  const edgesSphereY = useMemo(
    () => mergeVertices(new HorizontalLinesGeometry(sphere, "y")),
    [torus, resolution]
  );

  const wireframeSphere = useMemo(
    () => recomputeNormals(new WireframeGeometry(sphere)),
    [sphere, resolution]
  );

  const wireframeOctahedron = useMemo(
    () => recomputeNormals(new WireframeGeometry(octahedron)),
    [octahedron, resolution]
  );
  const wireframeIcosahedron = useMemo(
    () => recomputeNormals(new WireframeGeometry(icosahedron)),
    [icosahedron, resolution]
  );
  const wireframeTorus = useMemo(
    () => recomputeNormals(new WireframeGeometry(torus)),
    [torus, resolution]
  );

  return [
    // style solid or points
    dipyramid,
    octahedron,
    icosahedron,
    torus,

    // style wireframe
    wireframeSphere,
    wireframeOctahedron,
    wireframeIcosahedron,
    wireframeTorus,

    // style edges
    edgesSphereX,
    edgesSphereY,
    edgesTorusX,
    edgesTorusY,
  ];
}

export function useAudioTexture(analyser: Pick<CanvasProps, "getFFT">) {
  const { texture, buffer, ROW } = useMemo(() => {
    const SIZE = 128;
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
      const fft = analyser.getFFT(); // 64 values 0-255
      // console.log("FFT", fft);

      for (let i = 0; i < fft.length; i++) {
        let v = fft[i];
        const idx = i * 4; // row 0 offset
        const mix_min = 0.05;
        const max_max = 0.99;
        let pv = buffer[idx];
        if (pv > v) {
          v = pv * (1.0 - mix_min) + v * mix_min; // smooth
        } else if (pv < v) {
          v = pv * (1.0 - max_max) + v * max_max; // smooth
        }

        buffer[idx] = buffer[idx + 1] = buffer[idx + 2] = v;
        buffer[idx + 3] = 255; // alpha
      }

      texture.needsUpdate = true;
    } catch (_) {}
  });

  return texture; // DataTexture 64×64
}

export function useUniforms(
  controls: ShaderControls,
  speedControls: number,
  analyser: Pick<CanvasProps, "getFFT" | "getRMS">
): RefObject<GenerativeShaderUniforms> {
  // initial values for uniforms
  const uniforms = useRef<GenerativeShaderUniforms>(generateDefaults());

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
    // console.log("useTransforms", ref);
    // ref.current.geometry.center();
    // ref.current.position.x = 0.0;
    // ref.current.position.y = 0.0;
    // ref.current.position.z = 0.0;
    // ref.current.rotation.x += 0.1;
    // ref.current.rotation.y += 0.08;
    // ref.current.rotation.y += 0.06;
  });

  return ref;
}

function recomputeNormals(g: BufferGeometry) {
  if (BYPASS_NORMALS) return g;
  const a = mergeVertices(g);
  a.computeVertexNormals();
  return a;
}
