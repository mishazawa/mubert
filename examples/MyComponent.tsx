import Scene from "mubert";
import { useSound } from "./useSound";

export function MyComponent() {
  const SEED = 1234;
  const fft = useSound();
  return <Scene seed={SEED} {...fft} />;
}
