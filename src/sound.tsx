import { useCallback, useEffect, useMemo, useRef } from "react";

export const FFT_SIZE = 64;

export function useSound(audioRef: HTMLAudioElement) {
  const ctx = useMemo(() => new AudioContext(), []);
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

  // const getRMS = useCallback((): [number, number] => {
  //   const max = data.current[0];
  //   // const max = Math.max(...data.current);

  //   const res = data.current
  //     .map((val) => val * val)
  //     .reduce((acum, val) => acum + val);
  //   const rms = Math.sqrt(res / data.current.length);
  //   return [rms, max];
  // }, []);

  const getRMS = useCallback((): [number, number] => {
    const arr = data.current;
    const sum = arr.reduce((acc, v) => acc + v, 0);
    const max = sum / arr.length / 255;
    return [max, max];
    
  }, []);


  useEffect(() => {
    if (!audioRef) return;
    const source = ctx.createMediaElementSource(audioRef);
    source.connect(analyser);
    analyser.connect(ctx.destination);
  }, [audioRef, ctx]);

  return {
    getRMS,
    getFFT,
  };
}
