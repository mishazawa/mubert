import { useFrame, useThree } from "@react-three/fiber";
import {
  PARTICLES_CAMERA_ZOOM,
  PARTICLES_SIZE_RENDER_PASS,
  PARTICLES_TEXTURE_SIZE,
} from "../../../constants";
import { useEffect, useMemo, useRef } from "react";
import {
  Scene,
  type PerspectiveCamera,
  type Mesh,
  type PointsMaterial,
  type DataTexture,
} from "three";
import { useDebug } from "../../../hooks/useDebug";
import { useFBO } from "@react-three/drei";
import { useSharedTextures } from "../../../hooks/useSharedTextures";
import { useSharedUniforms } from "../../../hooks/useSharedUniforms";

export function useParticlesRefractionTexture() {
  const disableRefraction = useDebug("disableRefraction", true);
  const originalRef = useRef<Mesh>(null!);
  const cloneRef = useRef<Mesh>(null!);
  const renderScene = useMemo(() => new Scene(), []);
  const gl = useThree((state) => state.gl);
  const mainCamera = useThree((state) => state.camera);

  // out
  const renderTarget = useFBO(PARTICLES_TEXTURE_SIZE, PARTICLES_TEXTURE_SIZE);

  // setup camera clone
  const renderCamera = useMemo(() => {
    const cam: PerspectiveCamera = mainCamera.clone() as PerspectiveCamera;
    cam.zoom = PARTICLES_CAMERA_ZOOM;
    cam.aspect = 1;
    cam.updateProjectionMatrix();
    return cam;
  }, [mainCamera]);

  // setup particles
  useEffect(() => {
    if (!originalRef.current) return;

    const clone = originalRef.current.clone();

    clone.material = (originalRef.current.material as PointsMaterial).clone();

    if ("size" in clone.material)
      clone.material.size = PARTICLES_SIZE_RENDER_PASS;
    clone.material.needsUpdate = true;

    renderScene.add(clone);
    cloneRef.current = clone;

    return () => {
      renderScene.remove(clone);
    };
  }, []);

  // render loop
  useFrame(() => {
    if (disableRefraction) return;
    if (!cloneRef.current) return;

    // camera
    renderCamera.matrix.copy(mainCamera.matrix);
    renderCamera.matrix.decompose(
      renderCamera.position,
      renderCamera.quaternion,
      renderCamera.scale
    );

    // particles
    cloneRef.current.matrix.copy(originalRef.current.matrix);
    cloneRef.current.matrix.decompose(
      cloneRef.current.position,
      cloneRef.current.quaternion,
      cloneRef.current.scale
    );

    // render to fbo and swap back
    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(renderScene, renderCamera);
    gl.setRenderTarget(null);
  });

  // update uniforms
  const { uRefractionTex } = useSharedTextures();
  const sharedUniforms = useSharedUniforms();

  uRefractionTex.current = renderTarget.texture as DataTexture;
  uRefractionTex.current.needsUpdate = true;

  // maybe rm
  (sharedUniforms.current.uRefractionTex.value as any) = uRefractionTex.current;
  (sharedUniforms.current.uParticlesRes.value as any) = [
    PARTICLES_TEXTURE_SIZE,
    PARTICLES_TEXTURE_SIZE,
  ];

  return originalRef;
}
