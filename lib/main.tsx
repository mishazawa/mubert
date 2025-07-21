import { VALID_RANGES } from "./constants";
import type { CanvasProps } from "./types";

import {
  getColors,
  getVector3,
  randomGenerator,
  randomSwapRange,
} from "./utils";

import type { ShaderControls } from "./shaders/types";

import { ParametersContextWrap } from "./hooks/useParameters";
import { Scene } from "./components/Scene";

export default function MubertCanvas(
  props: CanvasProps & {
    debug?: any;
  }
) {
  return (
    <ParametersContextWrap {...props}>
      <Scene />
    </ParametersContextWrap>
  );
}

export function generateShaderParams(uSeed: number): ShaderControls {
  const gen = randomGenerator(uSeed);
  const palette = getColors(gen);

  return {
    uSeed,
    uLineWidth: gen.float(0, 1),
    uColor1: palette[0],
    uColor2: palette[1],
    uColor3: palette[2],
    uColor4: palette[3],
    uColor5: palette[4],
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
    uLineCount: gen.int(...VALID_RANGES.uLineCount),
    uNoiseOffset: getVector3(gen),
    uRoughnessPattern: gen.float(0, 1),
    uNoiseVariant: gen.float(0, 1),
    uStripesWidth: gen.float(...VALID_RANGES.uStripesWidth),
    uEmission: gen.float(0, 1),
  };
}
