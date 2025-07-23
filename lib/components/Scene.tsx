import { Suspense, useContext, useEffect, useRef } from "react";
import { ParamsContext } from "../hooks/useParameters";
import {
  Icosahedron,
  StatsGl,
  TrackballControls,
  useContextBridge,
  PerspectiveCamera as CameraPer,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { AMBIENT_LIGHT_COLOR } from "../constants";
import { FX } from "../effects";
import { EnvironmentLight } from "./EnvironmentLight";
import { Model } from "./Model";
import { Particles } from "./particles/Particles";
import { UniformsProvider } from "../hooks/useSharedUniforms";

const initialPositions = [
  [-4, 20, -12],
  [-10, 12, -4],
  [-11, -12, -23],
  [-16, -6, -10],
  [12, -2, -3],
  [13, 4, -12],
  [14, -2, -23],
  [8, 10, -20],
];

export function Scene() {
  const ContextBridge = useContextBridge(ParamsContext);
  const ctx = useContext(ParamsContext);

  const bkg: [number, number, number] = (ctx.palette[5] as [
    number,
    number,
    number
  ]) ?? [0xff, 0x00, 0xff];

  return (
    <ContextBridge>
      <Canvas className="vis_canvas" dpr={1}>
        <UniformsProvider>
          <color attach="background" args={bkg} />
          {/* TO BE REMOVED */}
          <StatsGl showPanel={1} className="stats" />

          <EnvironmentLight intensity={10} preset={ctx.debug.light} />
          <Suspense fallback={null}>
            {!ctx.debug.enableParticles ? null : <Particles />}
            <Model />
            {!ctx.debug.background
              ? null
              : initialPositions.map((pos, i) => (
                  <Icosahedron
                    args={[1, 8]}
                    position={[pos[0] * 0.5, pos[1] * 0.5, pos[2] * 0.5]}
                    key={i}
                  />
                ))}
          </Suspense>

          <LensCamera {...ctx.debug} />
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

function LensCamera({ distance, lens }: any) {
  const cam = useRef<PerspectiveCamera>(null!);

  useEffect(() => {
    if (!cam.current) return;
    cam.current.setFocalLength(lens);
  }, [lens]);

  return (
    <CameraPer
      ref={cam}
      position={[0, 0, distance]}
      makeDefault={true}
      far={20.0}
    />
  );
}
