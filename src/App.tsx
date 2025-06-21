import Canvas from "@lib/main";

import {
  useDebugShader,
  useShaderState,
  // useShaderStatePublic, // uncomment for demo
} from "./controls";

function App() {
  // const { data, debug } = useShaderStatePublic(); // uncomment for demo
  const data = useShaderState();
  const debug = useDebugShader();
  return <Canvas data={data} debug={debug} />;
}

export default App;
