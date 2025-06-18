import Canvas from "@lib/main";

import { useShaderStatePublic } from "./controls";

function App() {
  const { data, debug } = useShaderStatePublic();
  // const debug = useDebugShader();
  return <Canvas data={data} debug={debug} />;
}

export default App;
