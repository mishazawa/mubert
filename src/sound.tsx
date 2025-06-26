import { FFT_SIZE } from "@lib/constants";
import imgUrl from "./test_sound.mp3";
import { useCallback, useEffect, useMemo, useRef } from "react";

export function useSound() {
  const audio = useMemo<HTMLAudioElement>(
    () => document.getElementById("audio")! as HTMLAudioElement,
    []
  );

  const ctx = useMemo(() => new AudioContext(), []);
  const source = useRef<any>(null!);

  const analyser = useMemo(() => {
    const a = ctx.createAnalyser();
    a.fftSize = FFT_SIZE;
    return a;
  }, [ctx]);

  const data = useRef<Uint8Array>(new Uint8Array(analyser.frequencyBinCount));

  const getFFT = useCallback(() => {
    analyser.getByteFrequencyData(data.current);
    return Array.from(data.current);
  }, []);

  const getRMS = useCallback((): [number, number] => {
    const arr = data.current;
    const sum = arr.reduce((acc, v) => acc + v, 0);
    const max = sum / arr.length / 255;
    return [max, max];
  }, []);

  useEffect(() => {
    audio.src = imgUrl;
    audio.play();
    if (!source.current) {
      source.current = ctx.createMediaElementSource(audio);
      source.current.connect(analyser);
      analyser.connect(ctx.destination);
    }
  }, [audio]);

  return {
    getRMS,
    getFFT,
  };
}
