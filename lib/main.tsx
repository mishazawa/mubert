import type { CanvasProps, OptionalProps } from "./types";

import { ParametersContextWrap } from "./hooks/useParameters";
import { Scene } from "./components/Scene";
import { TexturesProvider } from "./hooks/useSharedTextures";
import { FFT_SIZE } from "./constants";
import { Overlay } from "./components/utils/Overlay";

export { PALETTES } from "./palettes";

export default function MubertCanvas(props: CanvasProps & OptionalProps) {
  return (
    <TexturesProvider>
      <ParametersContextWrap {...props}>
        <Scene />
        <Overlay />
      </ParametersContextWrap>
    </TexturesProvider>
  );
}

export const FFT_DATA_SIZE = FFT_SIZE * 2;
