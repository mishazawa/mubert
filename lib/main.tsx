import type { CanvasProps } from "./types";

import { ParametersContextWrap } from "./hooks/useParameters";
import { Scene } from "./components/Scene";
import { TexturesProvider } from "./hooks/useSharedTextures";

export default function MubertCanvas(props: CanvasProps) {
  return (
    <TexturesProvider>
      <ParametersContextWrap {...props}>
        <Scene />
      </ParametersContextWrap>
    </TexturesProvider>
  );
}
