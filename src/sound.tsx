import { useCallback } from "react";
declare global {
  interface Window {
    dataArray: Uint8Array;
  }
}
export function useSound() {
  const getFFT = useCallback(() => {
    return Array.from(window.dataArray);
  }, []);

  const getRMS = useCallback((): [number, number] => {
    var arr = window.dataArray;
    var sum = arr.reduce((acc: number, v: number) => acc + v, 0);
    var max = sum / arr.length / 255;
    // var max = Math.max(...arr) / 255;
    return [max, max];
  }, []);

  return {
    getRMS,
    getFFT,
  };
}
