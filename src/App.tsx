import Canvas from "@lib/main";

import { useShaderState } from "./controls";

import { useSound } from "./sound";

function App() {
  const [data, debug] = useShaderState();
  const fftfns = useSound();
  return (
    <>
      <Canvas data={data} debug={debug} {...fftfns} />
    </>
  );
}

export default App;
