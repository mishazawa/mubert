import { Suspense, useContext, useEffect, useRef, type ReactNode } from "react";
import { ParamsContext } from "../hooks/useParameters";
import {
  StatsGl,
  TrackballControls,
  useContextBridge,
  PerspectiveCamera as CameraPer,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  ClampToEdgeWrapping,
  DataTexture,
  LinearFilter,
  RepeatWrapping,
  RGBAFormat,
  UnsignedByteType,
  type PerspectiveCamera,
} from "three";
import {
  AMBIENT_LIGHT_COLOR,
  AUDIO_TEXTURE_SIZE,
  CAMERA_DISTANCE,
  CAMERA_FOV,
} from "../constants";
import { FX } from "../effects";
import { EnvironmentLight } from "./EnvironmentLight";
import { Model } from "./Model";
import { Particles } from "./particles/Particles";
import { UniformsProvider } from "../hooks/useSharedUniforms";
import { useCreateSharedTexture } from "../hooks/useSharedTextures";
import { useTransforms } from "./hooks";

export function Scene() {
  const ContextBridge = useContextBridge(ParamsContext);
  const ctx = useContext(ParamsContext);

  const bkg: [number, number, number] = (ctx.palette[4] as [
    number,
    number,
    number
  ]) ?? [0xff, 0x00, 0xff];

  useCreateSharedTexture(
    "uRefractionTex",
    () => {
      // Create checkerboard texture
      const size = ctx.debug.particlesCount;
      const data = new Uint8Array(size * size * 4);

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const checker = ((x >> 4) + (y >> 4)) & 1;
          const color = checker ? 255 : 0;

          data[i] = color; // R
          data[i + 1] = color; // G
          data[i + 2] = color; // B
          data[i + 3] = 255; // A
        }
      }

      const tex = new DataTexture(data, size, size, RGBAFormat);
      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;
      tex.needsUpdate = true;
      return tex;
    },
    [ctx.debug.particlesCount]
  );

  useCreateSharedTexture(
    "uAudioTex",
    () => {
      const data = new Uint8Array(AUDIO_TEXTURE_SIZE * AUDIO_TEXTURE_SIZE * 4);
      const tex = new DataTexture(
        data,
        AUDIO_TEXTURE_SIZE,
        AUDIO_TEXTURE_SIZE,
        RGBAFormat,
        UnsignedByteType
      );
      tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
      tex.magFilter = tex.minFilter = LinearFilter;
      tex.needsUpdate = true;
      return tex;
    },
    []
  );

  return (
    <ContextBridge>
      <Canvas className="vis_canvas" dpr={1}>
        <UniformsProvider>
          <color attach="background" args={bkg} />
          {/* TO BE REMOVED */}
          <StatsGl showPanel={1} className="stats" />

          <EnvironmentLight intensity={10} preset={ctx.debug.light} />
          <Suspense fallback={null}>
            <TransformGroup>
              <Particles />
              <Model />
            </TransformGroup>
          </Suspense>

          <LensCamera />
          <TrackballControls
            noPan
            dynamicDampingFactor={ctx.debug.dampingFactor}
            zoomSpeed={0.1}
            minDistance={2}
            maxDistance={10}
          />
          <ambientLight color={AMBIENT_LIGHT_COLOR} intensity={10} />
          <FX />
        </UniformsProvider>
      </Canvas>
    </ContextBridge>
  );
}

function LensCamera() {
  const cam = useRef<PerspectiveCamera>(null!);

  useEffect(() => {
    if (!cam.current) return;
    cam.current.setFocalLength(CAMERA_FOV);
    cam.current.updateProjectionMatrix();
  });

  return (
    <CameraPer
      ref={cam}
      fov={CAMERA_FOV}
      position={[0, 0, CAMERA_DISTANCE]}
      makeDefault={true}
      far={50.0}
    />
  );
}

function TransformGroup({ children }: { children: ReactNode }) {
  const ref = useTransforms();
  return (
    <group ref={ref} position={[0, 0, 0]}>
      {children}
    </group>
  );
}
