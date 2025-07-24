import { VALID_RANGES } from "./constants";
import type { CanvasProps } from "./types";

import { getVector3, randomGenerator, randomSwapRange } from "./utils";

import type { ShaderControls } from "./shaders/types";

import { ParametersContextWrap } from "./hooks/useParameters";
import { Scene } from "./components/Scene";
import { TexturesProvider } from "./hooks/useSharedTextures";

export default function MubertCanvas(
  props: CanvasProps & {
    debug?: any;
  }
) {
  return (
    <ParametersContextWrap {...props}>
      <TexturesProvider>
        <Scene />
      </TexturesProvider>
    </ParametersContextWrap>
  );
}

export function generateShaderParams(uSeed: number): ShaderControls {
  const gen = randomGenerator(uSeed);


  const audioelm = document.querySelector("audio");
  const files = [
    "Autumn.mp3",
    "Bazoer.mp3",
    "Big Beat.mp3",
    "Bollywood Slow Ballad.mp3",
    "Braindance.mp3",
    "Brown Noise.mp3",
    "Cardio 120.mp3",
    "Cbdab7ce-1767-471f-b57e-a944ecb5c61f.mp3",
    "Dreamy.mp3",
    "Dubstep.mp3",
    "Dubtechno.mp3",
    "Electro House.mp3",
    "Ethnic 108.mp3",
    "Ethnic.mp3",
    "Fitness.mp3",
    "Focus.mp3",
    "Game.mp3",
    "Heroic.mp3",
    "IDM.mp3",
    "Industrial.mp3",
    "Malivar.mp3",
    "Moods.mp3",
    "Motorik.mp3",
    "MyOwnWay.mp3",
    "New Jack Swing.mp3",
    "Night.mp3",
    "Nu Disco.mp3",
    "Om.mp3",
    "Orchestral.mp3",
    "Pink Noise.mp3",
    "Post-Rock.mp3",
    "Psytrance.mp3",
    "Pumped.mp3",
    "Ref_TJID_09293065-dc89-4702-967e-0143ce168914.mp3",
    "Ref_TJID_0a7ff373-32a5-4c8c-9750-88c338105def.mp3",
    "Ref_TJID_92f4b544-4b3b-475d-a3dc-a1d2fe6102d1.mp3",
    "Ref_TJID_be305cc2-6345-4df9-9fcd-c50745646184.mp3",
    "Run 140.mp3",
    "Serious.mp3",
    "Sleep.mp3",
    "Slow Ballad.mp3",
    "Spooky.mp3",
    "Summer.mp3",
    "Tribal House.mp3",
    "Vaporwave.mp3",
    "Vogue.mp3",
    "Witch House.mp3"
  ];
  const file = files[gen.int(0, files.length - 1)];
  if (audioelm) {
    audioelm.setAttribute("src", `/music/${file}`);
    audioelm.load();
  }


  return {
    uSeed,
    uLineWidth: gen.float(0, 1),
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
