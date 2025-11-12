import { useRef, useEffect } from "react";
import {
  CAMERA_DAMPING,
  CAMERA_DISTANCE,
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_ROTATION_SPEED,
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

import { MathUtils } from "three";
import { useThree } from "@react-three/fiber";

/**
 * Keeps the smaller viewport side equal to `targetSizeWorld` (in world units),
 * assuming the camera is looking at (0,0,0) and orbits around the origin.
 */
function useFitSmallerSide({
  cam,
  targetSizeWorld = 4, // e.g. -1..1 -> 2
}: {
  cam: React.RefObject<PerspectiveCamera>;
  targetSizeWorld?: number;
}) {
  const { size } = useThree(); // gives width/height in px

  useEffect(() => {
    const camera = cam.current;
    if (!camera) return;

    const aspect = size.width / size.height;
    const minAspectFactor = Math.min(1, aspect);
    const fovRad = MathUtils.degToRad(camera.fov);
    const tanHalfFov = Math.tan(fovRad / 2);

    // required orbit radius so that the smaller side == targetSizeWorld
    const requiredDistance =
      targetSizeWorld / (2 * tanHalfFov * minAspectFactor);

    // keep current direction, just change radius
    const dir = new Vector3().copy(camera.position).normalize();
    camera.position.copy(dir.multiplyScalar(requiredDistance));
    camera.updateProjectionMatrix();
  }, [cam, size.width, size.height]);
}




export function AnimatedCamera() {
  const cam = useRef<PerspectiveCamera>(null!);

  useEffect(() => {
    if (!cam.current) return;
    cam.current.setFocalLength(CAMERA_FOV);
    cam.current.updateProjectionMatrix();
  });


  // Keep the smaller viewport side at -1..1 (size = 2 world units)
  useFitSmallerSide({ cam, targetSizeWorld: 2.5 });

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

  useFrame(({ camera }, dt) => {
    if (isCtrlsEnabled) return;
    const fft_val = uniforms.current.uRMS.value;
    const rot_speed = ctx.rot_speed.current * CAMERA_ROTATION_SPEED;
    _axis.setY(Math.cos(uniforms.current.uTime.value * 0.01)).normalize();
    camera.position.applyAxisAngle(_axis, fft_val * rot_speed);
    camera.lookAt(0, 0, 0);
  });
}
