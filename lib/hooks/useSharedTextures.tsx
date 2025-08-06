import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { DataTexture } from "three";

const SHARED_TEXTURES = [
  "uAudioTex",
  "uRefractionTex",
  "uSimulationTex",
] as const;

type SharedTextureKeys = (typeof SHARED_TEXTURES)[number];

export type SharedTextures = {
  [key in SharedTextureKeys]: RefObject<DataTexture>;
};

const Context = createContext<SharedTextures>(null!);

export const TexturesProvider = ({ children }: { children: ReactNode }) => {
  const uAudioTex = useRef<DataTexture>(null!);
  const uRefractionTex = useRef<DataTexture>(null!);
  const uSimulationTex = useRef<DataTexture>(null!);

  const tex = { uAudioTex, uRefractionTex, uSimulationTex };

  return <Context.Provider value={tex}>{children}</Context.Provider>;
};

export function useSharedTextures(): SharedTextures {
  const context = useContext(Context);
  if (!context)
    throw new Error("useSharedTextures must be used within TexturesProvider");
  return context;
}

export function useCreateSharedTexture(
  name: SharedTextureKeys,
  init: () => DataTexture,
  deps: any[]
) {
  const tex = useMemo(init, deps);
  const ctx = useSharedTextures();

  ctx[name].current = tex;
}
