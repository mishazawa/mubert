import Canvas from "@lib/main";

import {
  useDebugShader,
  useShaderState,
  // useShaderStatePublic, // uncomment for demo
} from "./controls";

import { useSound } from "./sound";

function App() {
  // const { data, debug } = useShaderStatePublic(); // uncomment for demo
  const debug = useDebugShader();
  const data = useShaderState();
  const fftfns = useSound();
  return (
    <>
      <Canvas data={data} debug={debug} {...fftfns} />
    </>
  );
}

export default App;
