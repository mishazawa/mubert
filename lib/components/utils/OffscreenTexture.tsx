import { useSharedTextures } from "../../hooks/useSharedTextures";
import { PerspectiveCamera, RenderTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";

import { DataTexture, PerspectiveCamera as PCam } from "three";
import { PARTICLES_CAMERA_ZOOM, PARTICLES_TEXTURE_SIZE } from "../../constants";
import { useSharedUniforms } from "../../hooks/useSharedUniforms";

export function OffscreenTexture({ children }: { children: ReactNode }) {
  const camera = useThree((s) => s.camera);
  const texture = useRef<DataTexture>(new DataTexture());
  const renderCamera = useRef<PCam>(null!);
  const uniforms = useSharedUniforms();

  // TODO make generic?
  (uniforms.current.uParticlesRes.value as any) = [
    PARTICLES_TEXTURE_SIZE,
    PARTICLES_TEXTURE_SIZE,
  ];

  const { uRefractionTex } = useSharedTextures();

  useFrame(() => {
    renderCamera.current.matrix.copy(camera.matrix);
    renderCamera.current.matrix.decompose(
      renderCamera.current.position,
      renderCamera.current.quaternion,
      renderCamera.current.scale
    );

    if (texture.current && uRefractionTex.current !== texture.current) {
      uRefractionTex.current = texture.current;
      uRefractionTex.current.needsUpdate = true;
    }
  });

  return (
    <RenderTexture ref={texture} anisotropy={0}>
      <PerspectiveCamera
        ref={renderCamera}
        makeDefault
        manual
        aspect={1 / 1}
        zoom={PARTICLES_CAMERA_ZOOM}
      />
      {children}
    </RenderTexture>
  );
}
