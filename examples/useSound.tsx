import { useCallback } from "react";

const rms = (): number => {
  var arr = window.fftData;
  var sum = arr.reduce((acc: number, v: number) => acc + v, 0);
  var max = sum / arr.length / 255;
  return max;
};

const fft = () => {
  return Array.from(window.fftData);
};

export function useSound() {
  const getFFT = useCallback(fft, []);
  const getRMS = useCallback(rms, []);

  return {
    getRMS,
    getFFT,
  };
}
