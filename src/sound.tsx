import { useCallback } from "react";

export function useSound() {
  const getFFT = useCallback(() => {
    //@ts-ignore
    return window.getFFT();
  }, []);

  const getRMS = useCallback((): [number, number] => {
    //@ts-ignore
    return window.getRMS();
  }, []);

  return {
    getRMS,
    getFFT,
  };
}
