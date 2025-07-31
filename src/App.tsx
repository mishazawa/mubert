import Canvas from "@lib/main";

import { useSeed, useDebugParams } from "./controls";

import { useSound } from "./sound";
import { randomGenerator } from "@lib/utils";
import { DebugProvider } from "@lib/hooks/useDebug";
import { useEffect, useMemo } from "react";

function App() {
  const seed = useSeed();
  const debug = useDebugParams();
  const fftfns = useSound();

  useAudioTrack(seed);

  return (
    <>
      <DebugProvider value={debug}>
        <Canvas seed={seed} {...fftfns} />
      </DebugProvider>
    </>
  );
}

function useAudioTrack(seed: number) {
  const gen = useMemo(() => randomGenerator(seed), []);

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
    "Witch House.mp3",
  ];

  useEffect(() => {
    const audioelm = document.querySelector("audio");

    if (audioelm) {
      const file = files[gen.int(0, files.length - 1)];
      audioelm.setAttribute("src", `/music/${file}`);
      audioelm.load();
    }
  }, [seed]);
}

export default App;
