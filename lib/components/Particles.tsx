import {
  useThree,
  useFrame,
  extend,
  type ThreeElement,
} from "@react-three/fiber";
import { useRef, useMemo } from "react";
import {
  Mesh,
  Scene,
  OrthographicCamera,
  ShaderMaterial,
  FloatType,
} from "three";
import { useParameters } from "./hooks";
import { shaderMaterial, useFBO } from "@react-three/drei";
import { FBO_SIZE } from "@lib/constants";

const VelocityMaterial = shaderMaterial(
  { time: 0 },
  // vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/ `
    uniform float time;
    varying vec2 vUv;
    void main() {
      gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) , 1.0);
    }
  `
);

// declaratively
extend({ VelocityMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    velocityMaterial: ThreeElement<typeof VelocityMaterial>;
  }
}

export function VelocityFieldPass() {
  const velocityFBO = useFBO(FBO_SIZE, FBO_SIZE, { type: FloatType });

  const quad = useRef<Mesh>(null!);

  const mat = useRef<ShaderMaterial>(null!);

  const { gl } = useThree();

  const scene = useMemo(() => new Scene(), []);
  const camera = useMemo(
    () => new OrthographicCamera(-1, 1, 1, -1, 0.1, 10),
    []
  );

  useFrame(({ clock }) => {
    mat.current.uniforms.time.value = clock.elapsedTime;
    quad.current.material = mat.current;

    gl.setRenderTarget(velocityFBO);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <primitive object={scene}>
      <mesh ref={quad} position-z={-1}>
        <planeGeometry args={[2, 2]} />
        <velocityMaterial ref={mat} />
      </mesh>
    </primitive>
  );
}
