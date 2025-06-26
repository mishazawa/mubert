import Canvas from "@lib/main";

import {
  useDebugShader,
  useShaderState,
  // useShaderStatePublic, // uncomment for demo
} from "./controls";
import { useSound } from "./sound";
import { useRef } from "react";
import imgUrl from "./test_sound.mp3";
function App() {
  const aref = useRef(null!);
  // const { data, debug } = useShaderStatePublic(); // uncomment for demo
  const data = useShaderState();
  const debug = useDebugShader();
  const fftfns = useSound(aref.current);
  return (
    <>
      <Canvas data={data} debug={debug} {...fftfns} />
      <audio ref={aref} src={imgUrl} controls autoPlay />
    </>
  );
}





export default App;

