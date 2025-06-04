import { Environment, Lightformer } from "@react-three/drei";
import { ENV_MAP_RESOLUTION } from "../constants";
import type { EnvironmentLightProps } from "../types";

export function EnvironmentLight({ intensity }: EnvironmentLightProps) {
  return (
    <Environment resolution={ENV_MAP_RESOLUTION}>
      <Lightformer
        intensity={intensity}
        position={[5, 5, 5]}
        scale={[5, 10, 1]}
      />
      <Lightformer
        intensity={intensity * 2}
        position={[-15, -5, 5]}
        scale={[10, 10, 1]}
        form="circle"
      />
    </Environment>
  );
}
