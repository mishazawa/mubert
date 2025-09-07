import { Suspense, useEffect, useState } from "react";
import { ParamsContext } from "../hooks/useParameters";
import { useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  AMBIENT_LIGHT_COLOR,
  AMBIENT_LIGHT_INTENSITY,
  ENVIRONMENT_LIGHT_INTENSITY,
  PARTICLES_SIZE,
  PARTICLES_SIZE_RENDER_PASS,
} from "../constants";
import { FX } from "../effects";
import { EnvironmentLight } from "./light/Light";
import { Model } from "./Model";
import { Particles } from "./particles/Particles";
import { UniformsProvider } from "../hooks/useSharedUniforms";
import { AnimatedCamera } from "./Camera";
import { Background } from "./background/Background";

import { useDebug } from "../hooks/useDebug";
import { OffscreenTexture } from "./utils/OffscreenTexture";
import { SimulationProvider } from "./particles/Simulation";
import { CustomTextureProvider } from "../hooks/useSharedTextures";

export function Scene() {
  const ContextBridge = useContextBridge(ParamsContext);

  const DebugTools = useDebugFps();

  const pointSize = useDebug("pointSize", 1);

  return (
    <ContextBridge>
      <Canvas className="vis_canvas" dpr={1}>
        <Suspense fallback={null}>
          <CustomTextureProvider>
            <UniformsProvider>
              <Background />

              {DebugTools && <DebugTools />}
              <EnvironmentLight intensity={ENVIRONMENT_LIGHT_INTENSITY} />

              <Model />

              <SimulationProvider>
                <Particles pointSize={PARTICLES_SIZE * pointSize} />

                <OffscreenTexture>
                  <Particles
                    pointSize={PARTICLES_SIZE_RENDER_PASS * pointSize}
                  />
                </OffscreenTexture>
              </SimulationProvider>

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
