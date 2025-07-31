import { useDebug } from "../hooks/useDebug";
import { N8AO } from "@react-three/postprocessing";

export function AO() {
  const ao = useDebug("ao", {});

  return <N8AO {...ao} />;
}
