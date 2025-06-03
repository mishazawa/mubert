import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, StatsGl } from "@react-three/drei";
import { Model } from "./components/Model";
import { EnvironmentLight } from "./components/EnvironmentLight";
// import { PostFx } from "./components/PostFx";
import "./types.d";

export default function MubertCanvas() {
  return (
    <Canvas>
      {/* TO BE REMOVED */}
      <StatsGl showPanel={1} className="stats" />
      {/* <Stage
        preset="soft"
        intensity={4}
        adjustCamera={false}
        shadows={false}
        environment={null}
      > */}
      <Center>
        <EnvironmentLight intensity={10} />
        <Model />
      </Center>
      {/* </Stage> */}
      <OrbitControls />
      {/* <PostFx /> */}
    </Canvas>
  );
}
