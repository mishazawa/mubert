import { useParameters } from "../hooks/useParameters";
import { N8AO } from "@react-three/postprocessing";

export function SolidOnlyAO() {
  const ctx = useParameters();
  return <N8AO {...ctx.debug.ao} />;
}
