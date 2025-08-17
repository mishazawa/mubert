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

import { TrackballControls } from "@react-three/drei";
import { useDebug } from "../hooks/useDebug";
import { useSharedUniforms } from "../hooks/useSharedUniforms";
import { useParameters } from "../hooks/useParameters";
import { useFrame } from "@react-three/fiber";

export function AnimatedCamera() {
  const cam = useRef<PerspectiveCamera>(null!);

  useEffect(() => {
    if (!cam.current) return;
    cam.current.setFocalLength(CAMERA_FOV);
    cam.current.updateProjectionMatrix();
  });

  const isEnabled = useDebug("controls", false);
  useCameraAnimation();
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
        enabled={isEnabled}
        noPan
        dynamicDampingFactor={CAMERA_DAMPING}
        zoomSpeed={CAMERA_ZOOM_SPEED}
        minDistance={CAMERA_ZOOM_NEAR}
        maxDistance={CAMERA_ZOOM_FAR}
      />
    </>
  );
}

const _axis = new Vector3();

function useCameraAnimation() {
  const ctx = useParameters();
  const uniforms = useSharedUniforms();
  const isCtrlsEnabled = useDebug("controls", false);

  useFrame(({ camera }) => {
    if (isCtrlsEnabled) return;
    const fft_val = uniforms.current.uRMS.value;
    const rot_speed = ctx.rot_speed.current * 0.01;
    _axis.setY(Math.sin(uniforms.current.uTime.value * 0.01)).normalize();
    // camera.position.applyAxisAngle(_axis, fft_val * rot_speed);
    camera.lookAt(0, 0, 0);
  });
}
