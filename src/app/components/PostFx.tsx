import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { VerticalBlurShader } from "@/app/effects/Blur";

import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  ShaderPass,
} from "postprocessing";

extend({
  RenderPass,
  EffectComposer,
  VerticalBlurShader,
});

export function PostFx() {
  const { camera, gl, scene } = useThree();
  const composer = useRef<EffectComposer>(null!);

  const blurFx = useBlurPass();

  useEffect(() => {
    // maybe remove later?
    // bug in librewolf
    const [w, h] = [
      Math.min(1024, window.innerWidth),
      Math.min(1024, window.innerHeight),
    ];

    // add passes here
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(scene, camera));
    composer.current.addPass(new EffectPass(camera, new BloomEffect()));
    composer.current.addPass(new ShaderPass(blurFx.current, "tDiffuse"));

    // update renderer after window resize
    composer.current.setSize(w, h);
  }, [gl, scene, camera]);

  useFrame(() => {
    composer.current?.render();
  }, 1);

  return null;
}

function useBlurPass() {
  const { camera, gl, scene, clock } = useThree();

  const blurFx = useRef<VerticalBlurShader>(null!);

  // boilerplate code for recreating shader instance
  // when something happens to renderer (f.e. rerender)
  useEffect(() => {
    blurFx.current = new VerticalBlurShader();
  }, [gl, scene, camera]);

  // animate fx uniforms here
  useFrame(() => {
    blurFx.current.uniforms.v = {
      value: Math.sin(clock.getElapsedTime()) / 512,
    };
  });

  return blurFx;
}
