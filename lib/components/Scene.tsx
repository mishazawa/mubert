import { Suspense, useEffect, useState } from "react";
import { ParamsContext } from "../hooks/useParameters";
import { useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  AMBIENT_LIGHT_COLOR,
  AMBIENT_LIGHT_INTENSITY,
  ENVIRONMENT_LIGHT_INTENSITY,
} from "../constants";
import { FX } from "../effects";
import { EnvironmentLight } from "./light/Light";
import { Model } from "./Model";
import { UniformsProvider } from "../hooks/useSharedUniforms";
import { AnimatedCamera } from "./Camera";
import { Background } from "./background/Background";

import { CustomTextureProvider } from "../hooks/useSharedTextures";
import { FrameLimiter } from "./utils/FrameLimiter";

export function Scene() {
  const ContextBridge = useContextBridge(ParamsContext);

  const DebugTools = useDebugFps();

  return (
    <ContextBridge>
      <Canvas className="vis_canvas" dpr={1} frameloop="never">
        <Suspense fallback={null}>
          <FrameLimiter fps={60} />
          <CustomTextureProvider>
            <UniformsProvider>
              <Background />

              {DebugTools && <DebugTools />}
              <EnvironmentLight intensity={ENVIRONMENT_LIGHT_INTENSITY} />

              <Model />

              <AnimatedCamera />

              <ambientLight
                color={AMBIENT_LIGHT_COLOR}
                intensity={AMBIENT_LIGHT_INTENSITY}
              />
              <FX />
            </UniformsProvider>
          </CustomTextureProvider>
        </Suspense>
      </Canvas>
    </ContextBridge>
  );
}

function useDebugFps() {
  const [DebugTools, setDebugTools] = useState<null | React.FC>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      import("./Fps").then((mod) => setDebugTools(() => mod.default));
    }
  }, []);

  return DebugTools;
}
