import { useEffect, useState } from "react";
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

export function Scene() {
  const ContextBridge = useContextBridge(ParamsContext);

  const light = useDebug("light", 0);

  const DebugTools = useDebugFps();

  return (
    <ContextBridge>
      <Canvas className="vis_canvas" dpr={1}>
        <UniformsProvider>
          <Background />

          {DebugTools && <DebugTools />}
          <EnvironmentLight
            intensity={ENVIRONMENT_LIGHT_INTENSITY}
            preset={light}
          />

          <Model />

          <SimulationProvider>
            <Particles pointSize={PARTICLES_SIZE} />

            <OffscreenTexture>
              <Particles pointSize={PARTICLES_SIZE_RENDER_PASS} />
            </OffscreenTexture>
          </SimulationProvider>

          <AnimatedCamera />

          <ambientLight
            color={AMBIENT_LIGHT_COLOR}
            intensity={AMBIENT_LIGHT_INTENSITY}
          />
          <FX />
        </UniformsProvider>
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
