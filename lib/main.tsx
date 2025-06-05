import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, StatsGl } from "@react-three/drei";
import { Model } from "./components/Model";
import { EnvironmentLight } from "./components/EnvironmentLight";
// import { PostFx } from "./components/PostFx";
import "./types";
import type { RefObject } from "react";
import type { ShaderControls } from "./types";

export default function MubertCanvas(props: {
  data: RefObject<ShaderControls>;
}) {
  console.log("Render occurred");
  return (
    <Canvas>
      {/* TO BE REMOVED */}
      <StatsGl showPanel={1} className="stats" />

      <Center>
        <EnvironmentLight intensity={10} />
        <Model {...props} />
      </Center>

      <OrbitControls />
      {/* <PostFx /> */}
      <ambientLight color={0x404040} intensity={10} />
    </Canvas>
  );
}
