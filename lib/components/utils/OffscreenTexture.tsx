import { PerspectiveCamera, RenderTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";

import { DataTexture, PerspectiveCamera as PCam } from "three";

export function OffscreenTexture({ children }: { children: ReactNode }) {
  const camera = useThree((s) => s.camera);
  const texture = useRef<DataTexture>(new DataTexture());
  const renderCamera = useRef<PCam>(null!);

  useFrame(() => {
    renderCamera.current.matrix.copy(camera.matrix);
    renderCamera.current.matrix.decompose(
      renderCamera.current.position,
      renderCamera.current.quaternion,
      renderCamera.current.scale
    );

    if (texture.current /* && uRefractionTex.current !== texture.current*/) {
      // example
      // uRefractionTex.current = texture.current;
      // uRefractionTex.current.needsUpdate = true;
    }
  });

  return (
    <RenderTexture ref={texture} anisotropy={0}>
      <PerspectiveCamera
        ref={renderCamera}
        makeDefault
        manual
        aspect={1 / 1}
        zoom={1}
      />
      {children}
    </RenderTexture>
  );
}
