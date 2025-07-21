import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  PointsMaterial,
} from "three";
import { useParameters } from "../../hooks/useParameters";
import { GPUComputationRenderer } from "three/examples/jsm/Addons.js";

import CustomShaderMaterial from "three-custom-shader-material";

import fragmentShaderVel from "./shaders/velocity.glsl?raw";
import fragmentShaderPos from "./shaders/position.glsl?raw";

import dummyPos from "./shaders/dummyv.glsl?raw";
import dummyFrag from "./shaders/dummyf.glsl?raw";

type ParticlesProps = {
  resolution: number;
};

export function Particles({ resolution }: ParticlesProps) {
  const ctx = useParameters();
  const { gl } = useThree();
  const mat = useRef(null!);

  const [sim, positionTexture] = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(resolution, resolution, gl);

    const pos0 = gpuCompute.createTexture();
    const vel0 = gpuCompute.createTexture();

    const velVar = gpuCompute.addVariable(
      "textureVelocity",
      fragmentShaderVel,
      vel0
    );
    const posVar = gpuCompute.addVariable(
      "texturePosition",
      fragmentShaderPos,
      pos0
    );

    gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
    gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);

    velVar.material.uniforms.time = { value: 0.0 };

    const error = gpuCompute.init();
    if (error !== null) {
      throw error;
    }

    return [gpuCompute, posVar];
  }, [resolution, gl]);

  useFrame(() => {
    sim.compute();
    ctx.ref_texture.current = sim.getCurrentRenderTarget(positionTexture)
      .texture as DataTexture;
    ctx.ref_texture.current.needsUpdate = true;
  });

  const geo = useMemo(() => {
    let pg = new BufferGeometry();
    let pos = new Float32Array(resolution * resolution * 3);
    for (let i = 0; i < resolution * resolution; i++) {
      pos.set([0, 0, 0], i * 3);
    }
    pg.setAttribute("position", new BufferAttribute(pos, 3));
    return pg;
  }, [resolution]);

  return (
    <points geometry={geo} visible>
      <CustomShaderMaterial
        ref={mat}
        uniforms={{
          texturePositions: { value: ctx.ref_texture.current },
        }}
        baseMaterial={PointsMaterial}
        vertexShader={dummyPos}
        fragmentShader={dummyFrag}
        transparent
        toneMapped={false}
        sizeAttenuation={true}
        size={ctx.debug.pointSize}
      />
    </points>
  );
}
