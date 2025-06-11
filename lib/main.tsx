import type { RefObject } from "react";
import { Color } from "three";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, StatsGl } from "@react-three/drei";

import { Model } from "./components/Model";
import { EnvironmentLight } from "./components/EnvironmentLight";
import { AMBIENT_LIGHT_COLOR, VALID_RANGES } from "./constants";
import type { ShaderControls } from "./types";

import { getColors, randomGenerator, randomSwapRange } from "./utils";

export default function MubertCanvas(props: { data: ShaderControls }) {
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
  const gen = randomGenerator(uSeed);
  const [primary, secondary] = getColors(gen);
  return {
    uSeed,
    uColor1: new Color(primary),
    uColor2: new Color(secondary),
    uUseColorKey: gen.int(...VALID_RANGES.use_key),
    uColorKeyValue: gen.int(...VALID_RANGES.key_value),
    uColorNoiseScale: gen.float(
      ...randomSwapRange(VALID_RANGES.color_noise, gen.float(0, 1))
    ),
    uDisplacementNoiseScale: gen.float(
      ...randomSwapRange(VALID_RANGES.displacement_noise, gen.float(0, 1))
    ),
    uDisplacementAmplitude: gen.float(...VALID_RANGES.amplitude),
    uRoughness: gen.float(...VALID_RANGES.roughness),
    uClearcoat: gen.float(...VALID_RANGES.clearcoat),
    uClearcoatRoughness: gen.float(...VALID_RANGES.cc_roughness),
    uIridescence: gen.float(...VALID_RANGES.iridescence),
  };
}
