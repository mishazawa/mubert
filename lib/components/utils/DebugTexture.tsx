import { useEffect, useRef, type RefObject } from "react";
import type { DataTexture, MeshBasicMaterial, Texture } from "three";

export function DebugTexture({
  texture,
}: {
  texture: RefObject<Texture | DataTexture>;
}) {
  const mat = useRef<MeshBasicMaterial>(null!);

  useEffect(() => {
    mat.current.map = texture.current;
    mat.current.needsUpdate = true;
  });
  return (
    <mesh scale={[2, 2, 1]} position={[0, -2, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={mat} toneMapped={false} />
    </mesh>
  );
}
