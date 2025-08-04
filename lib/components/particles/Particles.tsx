import { PointsMaterial } from "three";

import CustomShaderMaterial from "three-custom-shader-material";

import vertex from "./_vert.glsl?raw";
import fragment from "./_frag.glsl?raw";

import { PARTICLES_SIZE_RENDER_PASS } from "../../constants";
import { useDebug } from "../../hooks/useDebug";

import { useParticlesGeometry } from "./hooks/useParticlesGeometry";
import { useParticlesSimulation } from "./hooks/useParticlesSimulation";
import { useParticlesRefractionTexture } from "./hooks/useParticlesRefractionTexture";

export function Particles() {
  const pointSize = useDebug("pointSize", PARTICLES_SIZE_RENDER_PASS);
  const geo = useParticlesGeometry();
  const originalRef = useParticlesRefractionTexture();
  const { localUniforms } = useParticlesSimulation();

  return (
    <>
      <points ref={originalRef} geometry={geo}>
        <CustomShaderMaterial
          uniforms={localUniforms.current}
          baseMaterial={PointsMaterial}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          toneMapped={false}
          sizeAttenuation={true}
          size={pointSize}
        />
      </points>

      {/* <mesh scale={[2, 2, 1]} position={[0, -2, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={localUniforms.current.uPositionsTex.value}
          toneMapped={false}
        />
      </mesh> */}
    </>
  );
}
