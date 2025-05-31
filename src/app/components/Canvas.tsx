"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stage } from "@react-three/drei";
import { Model } from "./Model";
import { PostFx } from "./PostFx";

export default function ThreeCanvas() {
  return (
    <Canvas>
      <Environment files={"/photo_studio_01_1k.exr"} />

      <Stage intensity={0.5} adjustCamera={false} shadows={false}>
        <Model />
      </Stage>
      <OrbitControls />
      {/* <PostFx /> */}
    </Canvas>
  );
}
