import type { RefObject } from "react";
import { Color } from "three";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, StatsGl } from "@react-three/drei";

import { Model } from "./components/Model";
import { EnvironmentLight } from "./components/EnvironmentLight";
import { AMBIENT_LIGHT_COLOR, VALID_RANGES } from "./constants";
import type { ShaderControls } from "./types";

import {
  getColors,
  getRandomInt,
  getRandomFloat,
  randomSwapRange,
} from "./utils";

export default function MubertCanvas(props: {
  data: RefObject<ShaderControls>;
}) {
  return (
    <Canvas>
      {/* TO BE REMOVED */}
      <StatsGl showPanel={1} className="stats" />

      <Center>
        <EnvironmentLight intensity={10} />
        <Model {...props} />
      </Center>

      <OrbitControls />
      <ambientLight color={AMBIENT_LIGHT_COLOR} intensity={10} />
    </Canvas>
  );
}

export function generateShaderParams(uSeed: number): ShaderControls {
  const [primary, secondary] = getColors(uSeed);
  return {
    uSeed,
    uColor1: new Color(primary),
    uColor2: new Color(secondary),
    uUseColorKey: getRandomInt(...VALID_RANGES.use_key, uSeed),
    uColorKeyValue: getRandomInt(...VALID_RANGES.key_value, uSeed),
    uColorNoiseScale: getRandomFloat(
      ...randomSwapRange(VALID_RANGES.color_noise, uSeed),
      uSeed
    ),
    uDisplacementNoiseScale: getRandomFloat(
      ...randomSwapRange(VALID_RANGES.displacement_noise, uSeed),
      uSeed
    ),
    uDisplacementAmplitude: getRandomFloat(...VALID_RANGES.amplitude, uSeed),
    uRoughness: getRandomFloat(...VALID_RANGES.roughness, uSeed),
    uClearcoat: getRandomFloat(...VALID_RANGES.clearcoat, uSeed),
    uClearcoatRoughness: getRandomFloat(...VALID_RANGES.cc_roughness, uSeed),
    uIridescence: getRandomFloat(...VALID_RANGES.iridescence, uSeed),
  };
}
