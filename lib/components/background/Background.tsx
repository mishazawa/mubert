import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { ShaderMaterial, Uniform } from "three";
import vertexShader from "./_vert.glsl?raw";
import fragmentShader from "./_frag.glsl?raw";
import { useParameters } from "../../hooks/useParameters";
import { useSharedUniforms } from "../../hooks/useSharedUniforms";

export function Background() {
  const meshRef = useRef(null!);
  const { size } = useThree();
  const ctx = useParameters();
  const sharedUniforms = useSharedUniforms();
  // Create a custom ShaderMaterial once
  const shaderMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: new Uniform(0),
          uUseTex: new Uniform(false),
          uResolution: new Uniform([size.width, size.height]),
          uColor1: new Uniform(ctx.palette[0]),
          uColor2: new Uniform(ctx.palette[1]),
          uColor3: new Uniform(ctx.palette[2]),
          uColor4: new Uniform(ctx.palette[3]),
          uColor5: new Uniform(ctx.palette[4]),
          uCustomTex: sharedUniforms.current.uCustomTex,
        },
        vertexShader,
        fragmentShader,
        depthWrite: false,
        depthTest: false,
      }),
    [size, ctx.palette]
  );

  useFrame(() => {
    shaderMaterial.uniforms.uTime.value = sharedUniforms.current.uTime.value;
    shaderMaterial.uniforms.uUseTex.value = sharedUniforms.current.uUseTex.value;
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}
