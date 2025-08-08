import { PointsMaterial } from "three";

import CustomShaderMaterial from "three-custom-shader-material";

import vertex from "./_vert.glsl?raw";
import fragment from "./_frag.glsl?raw";

import { useParticlesGeometry } from "./hooks/useParticlesGeometry";
import { useParticlesSimulation } from "./hooks/useParticlesSimulation";
import { useDebug } from "../../hooks/useDebug";

export function Particles({ pointSize }: { pointSize: number }) {
  const geo = useParticlesGeometry();
  const localUniforms = useParticlesSimulation();
  const isEnabled = useDebug("particles", true);
  return !isEnabled ? null : (
    <>
      <points geometry={geo}>
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
    </>
  );
}
