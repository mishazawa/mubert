import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { DataTexture, Texture, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { useParameters } from "./useParameters";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SHARED_TEXTURES = ["uAudioTex"] as const;

type SharedTextureKeys = (typeof SHARED_TEXTURES)[number];

export type SharedTextures = {
  [key in SharedTextureKeys]: RefObject<DataTexture>;
};

type CustomTexture = {
  uCustomTex: Texture;
};

const Context = createContext<SharedTextures>(null!);
const CustomTextureContext = createContext<CustomTexture>(null!);

export const TexturesProvider = ({ children }: { children: ReactNode }) => {
  const uAudioTex = useRef<DataTexture>(null!);
  const tex = { uAudioTex };

  return <Context.Provider value={tex}>{children}</Context.Provider>;
};

export const CustomTextureProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { texture } = useParameters();

  const uCustomTex = useOptionalTexture(texture);

  const tex = { uCustomTex };

  return (
    <CustomTextureContext.Provider value={tex}>
      {children}
    </CustomTextureContext.Provider>
  );
};

export function useSharedTextures(): SharedTextures {
  const context = useContext(Context);
  if (!context)
    throw new Error("useSharedTextures must be used within TexturesProvider");
  return context;
}

export function useCustomTexture(): CustomTexture {
  const context = useContext(CustomTextureContext);
  if (!context)
    throw new Error(
      "useCustomTexture must be used within CustomTextureProvider"
    );
  return context;
}
export function useCreateSharedTexture(
  name: SharedTextureKeys,
  init: () => DataTexture,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[]
) {
  const tex = useMemo(init, deps);
  const ctx = useSharedTextures();

  ctx[name].current = tex;
}

function createBlankTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(0,0,0,0)"; // transparent pixel
  ctx.fillRect(0, 0, 2, 2);

  return canvas;
}

function useOptionalTexture(url?: string): Texture {
  const texture = url
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useLoader(TextureLoader, url) // suspends until loaded
    : new Texture(createBlankTexture()); // blank fallback texture

  return texture;
}
