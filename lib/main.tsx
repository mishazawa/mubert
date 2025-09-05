import type { CanvasProps, OptionalProps } from "./types";

import { ParametersContextWrap } from "./hooks/useParameters";
import { Scene } from "./components/Scene";
import { TexturesProvider } from "./hooks/useSharedTextures";
import { FFT_SIZE } from "./constants";

export default function MubertCanvas(props: CanvasProps & OptionalProps) {
  return (
    <TexturesProvider texture={props.texture}>
      <ParametersContextWrap {...props}>
        <Scene />
      </ParametersContextWrap>
    </TexturesProvider>
  );
}

export const FFT_DATA_SIZE = FFT_SIZE * 2;
