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
import { Spherical, Vector3, type PerspectiveCamera } from "three";
import { useFrame } from "@react-three/fiber";

import { TrackballControls } from "@react-three/drei";
import { useParameters } from "../hooks/useParameters";
const GIMBAL_THRESH = 0.001;

export function AnimatedCamera() {
  const cam = useRef<PerspectiveCamera>(null!);
  const ctx = useParameters();

  // example
  const ctrl = useCameraAnimation((s: Spherical) => {
    const rot_speed = ctx.rot_speed.current * 0.5;
    const t = ctx.fft.current.time;
    s.theta += 0.01 * rot_speed;
    s.phi += 0.005 * Math.sin(t);
  });

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

function useCameraAnimation(movement: (prev: Spherical) => void) {
  const ctx = useParameters();
  const controls = useRef<any>(null!);
  const _spherical = useRef(new Spherical());
  useFrame(({ camera }) => {
    if (ctx.debug.stopCamera) return;

    // vibe coding
    if (controls.current) {
      if (!controls.current) return;

      const target = controls.current.target! as Vector3;

      // Vector from target to camera
      const offset = camera.position.clone().sub(target);

      // Convert to spherical coordinates
      _spherical.current.setFromVector3(offset);

      // transform function
      movement(_spherical.current);

      // Rotate horizontally (azimuthal angle)
      _spherical.current.phi = Math.max(
        GIMBAL_THRESH,
        Math.min(Math.PI - GIMBAL_THRESH, _spherical.current.phi)
      );

      // Convert back to Cartesian
      offset.setFromSpherical(_spherical.current);

      // Apply new position
      camera.position.copy(target.clone().add(offset));
      camera.lookAt(target);

      // Sync controls
      controls.current.update();
    }
  });

  return controls;
}
