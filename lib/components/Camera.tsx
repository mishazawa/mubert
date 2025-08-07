import { useRef, useEffect } from "react";
import {
  CAMERA_DAMPING,
  CAMERA_DISTANCE,
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_ZOOM_FAR,
  CAMERA_ZOOM_NEAR,
  CAMERA_ZOOM_SPEED,
} from "../constants";
import { PerspectiveCamera as Cam } from "@react-three/drei";
import { Vector3, type PerspectiveCamera } from "three";
import { useFrame } from "@react-three/fiber";

import { TrackballControls } from "@react-three/drei";
import { useParameters } from "../hooks/useParameters";
import { useDebug } from "../hooks/useDebug";
import { useSharedUniforms } from "../hooks/useSharedUniforms";

export function AnimatedCamera() {
  const cam = useRef<PerspectiveCamera>(null!);
  const ctx = useParameters();

  // example
  const ctrl = useCameraAnimation(ctx.rot_speed.current);

  useEffect(() => {
    if (!cam.current) return;
    cam.current.setFocalLength(CAMERA_FOV);
    cam.current.updateProjectionMatrix();
  });

  return (
    <>
      <Cam
        ref={cam}
        fov={CAMERA_FOV}
        position={[0, 0, CAMERA_DISTANCE]}
        makeDefault={true}
        far={CAMERA_FAR}
      />
      <TrackballControls
        ref={ctrl}
        noPan
        dynamicDampingFactor={CAMERA_DAMPING}
        zoomSpeed={CAMERA_ZOOM_SPEED}
        minDistance={CAMERA_ZOOM_NEAR}
        maxDistance={CAMERA_ZOOM_FAR}
      />
    </>
  );
}

const _axis = new Vector3(0, 1, 0);
function useCameraAnimation(rot_speed: number) {
  const controls = useRef<any>(null!);

  const uniforms = useSharedUniforms();
  const stopCamera = useDebug("stopCamera", false);

  useFrame(({ camera }) => {
    if (stopCamera) return;

    if (controls.current) {
      if (!controls.current) return;

      controls.current.dispatchEvent({ type: "start" });

      const fft_val = uniforms.current.uRMS.value;

      camera.position.applyAxisAngle(_axis, fft_val * rot_speed);

      controls.current.update();
      controls.current.dispatchEvent({ type: "change" });
      controls.current.dispatchEvent({ type: "end" });
    }
  });

  return controls;
}
