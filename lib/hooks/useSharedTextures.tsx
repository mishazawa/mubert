import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { DataTexture, Texture, TextureLoader } from "three";

const SHARED_TEXTURES = [
  "uAudioTex",
  "uRefractionTex",
  "uSimulationTex",
] as const;

type SharedTextureKeys = (typeof SHARED_TEXTURES)[number];

export type SharedTextures = {
  [key in SharedTextureKeys]: RefObject<DataTexture>;
} & {
  uCustomTex: Texture;
};

const Context = createContext<SharedTextures>(null!);

export const TexturesProvider = ({
  children,
  texture,
}: {
  children: ReactNode;
  texture?: string;
}) => {
  const uAudioTex = useRef<DataTexture>(null!);
  const uRefractionTex = useRef<DataTexture>(null!);
  const uSimulationTex = useRef<DataTexture>(null!);
  const uCustomTex = useOptionalTexture(texture);

  const tex = { uAudioTex, uRefractionTex, uSimulationTex, uCustomTex };

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

function createBlankTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(0,0,0,0)"; // transparent pixel
  ctx.fillRect(0, 0, 2, 2);

  return canvas;
}

function useOptionalTexture(url?: string) {
  const [texture, setTexture] = useState<Texture>(
    new Texture(createBlankTexture())
  );

  useEffect(() => {
    if (!url) {
      setTexture(new Texture(createBlankTexture()));
      return;
    }

    const loader = new TextureLoader();
    loader.load(url, (loaded) => {
      setTexture(loaded);
    });
  }, [url]);

  return texture;
}
