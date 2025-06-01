"use client";

import { useFrame } from "@react-three/fiber";
import { RefObject, useMemo, useRef } from "react";
import { Audio, AudioListener, AudioAnalyser } from "three";
import { FFT_SIZE, TIME_MULTIPLIER } from "./constants";
import { AnalysisData } from "./types";

export function useAudioData(
  audio: RefObject<HTMLAudioElement>,
  data: Record<string, any>
): RefObject<AnalysisData> {
  const analyser = useInitAnalyser(audio);
  return useUpdateAnalysisData(analyser, audio, data);
}

// update data each frame
function useUpdateAnalysisData(
  analyser: AudioAnalyser | null,
  audio: RefObject<HTMLAudioElement>,
  misc: Record<string, any>
) {
  const data = useRef<AnalysisData>({
    fft: [] as unknown as Uint8Array<ArrayBufferLike>,
    playtime: 0,
    abstime: 0,
  });

  // set here
  useFrame(() => {
    data.current.abstime += misc.bpm * TIME_MULTIPLIER;

    if (!analyser) return;
    data.current.fft = analyser.getFrequencyData();

    if (isAudioPlaying(audio.current)) {
      data.current.playtime += misc.bpm * TIME_MULTIPLIER;
    }
  });

  return data;
}

// create analyzer when <audio/> instantiated
function useInitAnalyser(audio: RefObject<HTMLAudioElement>) {
  return useMemo(() => {
    if (!audio.current) return null;
    const listener = new AudioListener();
    const sound = new Audio(listener);
    sound.setMediaElementSource(audio.current);
    return new AudioAnalyser(sound, FFT_SIZE);
  }, [audio]);
}

function isAudioPlaying(audio: HTMLAudioElement | null): boolean {
  if (!audio) return false;
  return !audio.paused && !audio.ended && !audio.seeking;
}
