import { useCallback } from "react";

export function useSound() {
  const getFFT = useCallback(() => {
    //@ts-ignore
    return Array.from(window.dataArray);
  }, []);

  const getRMS = useCallback((): [number, number] => {
    //@ts-ignore
    var arr = window.dataArray;
    var sum = arr.reduce((acc: number, v: number) => acc + v, 0);
    var max = sum / arr.length / 255;
    return [max, max];
  }, []);

  return {
    getRMS,
    getFFT,
  };
}
