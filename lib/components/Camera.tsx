import { useRef, useEffect } from "react";
import {
  CAMERA_DISTANCE,
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_ROTATION_SPEED,
} from "../constants";
import { PerspectiveCamera as Cam } from "@react-three/drei";
import { Vector3, type PerspectiveCamera } from "three";

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
    </>
  );
}

const _axis = new Vector3();

function useCameraAnimation() {
  const ctx = useParameters();
  const uniforms = useSharedUniforms();
  const isCtrlsEnabled = useDebug("controls", false);

  useFrame(({ camera }, dt) => {
    if (isCtrlsEnabled) return;
    const fft_val = uniforms.current.uRMS.value;
    const rot_speed = ctx.rot_speed.current * dt * CAMERA_ROTATION_SPEED;
    _axis.setY(Math.cos(uniforms.current.uTime.value * 0.01)).normalize();
    camera.position.applyAxisAngle(_axis, fft_val * rot_speed);
    camera.lookAt(0, 0, 0);
  });
}
