import { SHADER_STYLE } from "../constants";
import { useParameters } from "../components/hooks";
import { N8AO } from "@react-three/postprocessing";

export function SolidOnlyAO() {
  const ctx = useParameters();
  if (SHADER_STYLE[ctx.debug.presetStyle] !== "solid") return null;
  return <N8AO {...ctx.debug.ao} />;
}
