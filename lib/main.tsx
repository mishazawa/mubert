import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stage, StatsGl } from "@react-three/drei";
import { Model } from "./components/Model";
// import { PostFx } from "./components/PostFx";
import "./types.d";
export default function MubertCanvas() {
  return (
    <Canvas>
      {/* TO BE REMOVED */}
      <StatsGl showPanel={1} className="stats" />
      <Environment preset="city" />

      <Stage intensity={0.5} adjustCamera={false} shadows={false}>
        <Model />
      </Stage>
      <OrbitControls />
      {/* <PostFx /> */}
    </Canvas>
  );
}
