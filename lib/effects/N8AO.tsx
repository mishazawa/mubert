import { useParameters } from "../hooks/useParameters";
import { N8AO } from "@react-three/postprocessing";

export function AO() {
  const ctx = useParameters();
  return <N8AO {...ctx.debug.ao} />;
}
