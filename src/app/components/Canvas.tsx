"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stage, StatsGl } from "@react-three/drei";
import { Model } from "./Model";
import { PostFx } from "./PostFx";

export default function ThreeCanvas() {
  return (
    <Canvas>
      {/* TO BE REMOVED */}
      <StatsGl showPanel={1} className="stats" />
      <Environment files={"/photo_studio_01_1k.exr"} />

      <Stage intensity={0.5} adjustCamera={false} shadows={false}>
        <Model />
      </Stage>
      <OrbitControls />
      {/* <PostFx /> */}
    </Canvas>
  );
}
