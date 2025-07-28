import { Suspense, useContext, type ReactNode } from "react";
import { ParamsContext } from "../hooks/useParameters";
import { StatsGl, useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  ClampToEdgeWrapping,
  DataTexture,
  LinearFilter,
  RepeatWrapping,
  RGBAFormat,
  UnsignedByteType,
} from "three";
import {
  AMBIENT_LIGHT_COLOR,
  AUDIO_TEXTURE_SIZE,
  PARTICLES_TEXTURE_SIZE,
} from "../constants";
import { FX } from "../effects";
import { EnvironmentLight } from "./light/Light";
import { Model } from "./Model";
import { Particles } from "./particles/Particles";
import { UniformsProvider } from "../hooks/useSharedUniforms";
import { useCreateSharedTexture } from "../hooks/useSharedTextures";
import { AnimatedCamera } from "./Camera";
import { Background } from "./background/Background";
import { useTransformsReactive } from "../hooks/useTransformsReactive";

export function Scene() {
  const ContextBridge = useContextBridge(ParamsContext);
  const ctx = useContext(ParamsContext);

  useCreateSharedTexture(
    "uRefractionTex",
    () => {
      // Create checkerboard texture
      const size = PARTICLES_TEXTURE_SIZE;
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
    []
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

  console.log("seed: " + ctx.data.uSeed);
  return (
    <ContextBridge>
      <Canvas className="vis_canvas" dpr={1}>
        <UniformsProvider>
          <Background />

          {/* <color attach="background" args={bkg} /> */}
          {/* TO BE REMOVED */}
          <StatsGl showPanel={1} className="stats" />

          <EnvironmentLight intensity={10} preset={ctx.debug.light} />
          <Suspense fallback={null}>
            <TransformGroup>
              <Particles />
              <Model />
            </TransformGroup>
          </Suspense>

          <AnimatedCamera />

          <ambientLight color={AMBIENT_LIGHT_COLOR} intensity={10} />
          <FX />
        </UniformsProvider>
      </Canvas>
    </ContextBridge>
  );
}

function TransformGroup({ children }: { children: ReactNode }) {
  const ref = useTransformsReactive();
  return (
    <group ref={ref} position={[0, 0, 0]}>
      {children}
    </group>
  );
}
