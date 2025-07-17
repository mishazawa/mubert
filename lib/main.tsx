import { Canvas } from "@react-three/fiber";
import {
  PerformanceMonitor,
  PerspectiveCamera as CameraPer,
  StatsGl,
  TrackballControls,
} from "@react-three/drei";

import { Model } from "./components/Model";
import { EnvironmentLight } from "./components/EnvironmentLight";
import { AMBIENT_LIGHT_COLOR, SHADER_STYLE, VALID_RANGES } from "./constants";
import type { CanvasProps } from "./types";

import {
  getColors,
  getVector3,
  randomGenerator,
  randomSwapRange,
} from "./utils";
import { useEffect, useRef, useState } from "react";
import type { ShaderControls } from "./shaders/types";
import { PerspectiveCamera, type Color } from "three";
import {
  DepthOfField,
  Bloom,
  Noise,
  EffectComposer,
  SSAO,
  ChromaticAberration,
  SMAA,
  N8AO,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";


const DISABLE_SSAO = false;

export default function MubertCanvas(
  props: CanvasProps & {
    debug?: any;
  }
) {
  const [dpr, setDpr] = useState(1);

  return (
    <Canvas className="vis_canvas" dpr={dpr}>
      <color attach="background" args={[props.data.uColor1 as Color]} />
      {/* TO BE REMOVED */}
      <StatsGl showPanel={1} className="stats" />
      <PerformanceMonitor
        factor={1}
        onChange={({ factor }) => setDpr(Math.floor(0.5 + 1.5 * factor))}
      />

      <EnvironmentLight intensity={1} preset={props.debug.light} />
      <Model {...props} />
      <LensCamera {...props.debug} />
      <TrackballControls
        noPan
        dynamicDampingFactor={props.debug.dampingFactor}
      />
      <ambientLight color={AMBIENT_LIGHT_COLOR} intensity={10} />

      <EffectComposer enableNormalPass={!DISABLE_SSAO}>
        {/* <SSAO
          blendFunction={BlendFunction.MULTIPLY} // blend mode
          samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
          rings={4} // amount of rings in the occlusion sampling pattern
          distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
          distanceFalloff={0.0} // distance falloff. min: 0, max: 1
          rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
          rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
          luminanceInfluence={0.9} // how much the luminance of the scene influences the ambient occlusion
          radius={20} // occlusion sampling radius
          bias={0.5} // occlusion bias
        /> */}

        {/* <Bloom
          intensity={
            props.debug.bloom *
            (SHADER_STYLE[props.debug.style] !== "solid" ? 5 : 1)
          }
          luminanceThreshold={
            props.debug.bloom -
            (SHADER_STYLE[props.debug.style] !== "solid" ? 0.9 : 2)
          }
          luminanceSmoothing={0.9}
        /> */}

        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[
            props.debug.chromaticAberration,
            props.debug.chromaticAberration,
          ]} // color offset
        />
        {/* <DepthOfField
          focusDistance={props.debug.focusDistance}
          focalLength={props.debug.focalLength}
          bokehScale={props.debug.bokehScale}
        /> */}
        <Noise opacity={props.debug.noise} />
        {/* <N8AO halfRes color="black" aoRadius={2} intensity={1} aoSamples={6} denoiseSamples={4} /> */}
        <Bloom mipmapBlur levels={7} intensity={1} />
        {/* <SMAA /> */}
      </EffectComposer>
    </Canvas>
  );
}

function LensCamera({ distance, lens }: any) {
  const cam = useRef<PerspectiveCamera>(null!);

  useEffect(() => {
    if (!cam.current) return;
    cam.current.setFocalLength(lens);
    // cam.current.far = distance * 2;
    // cam.current.updateProjectionMatrix();
  }, [lens]);

  return <CameraPer ref={cam} position={[0, 0, distance]} makeDefault={true} far={20.0}/>;
}

export function generateShaderParams(uSeed: number): ShaderControls {
  const gen = randomGenerator(uSeed);
  const palette = getColors(gen);

  window.fft_mix_min = Math.pow(gen.float(0, 1), 3.0)*0.5;
  window.fft_mix_max = gen.float(0.9, 1);
  window.rot_speed = gen.float(0, 0.1);

  return {
    uSeed,
    uLineWidth: gen.float(0, 1),
    uColor1: palette[0],
    uColor2: palette[1],
    uColor3: palette[2],
    uColor4: palette[3],
    uColor5: palette[4],
    uUseColorKey: gen.int(...VALID_RANGES.use_key),
    uColorKeyValue: gen.int(...VALID_RANGES.key_value),
    uColorNoiseScale: gen.float(
      ...randomSwapRange(VALID_RANGES.color_noise, gen.float(0, 1))
    ),
    uDisplacementNoiseScale: gen.float(
      ...randomSwapRange(VALID_RANGES.displacement_noise, gen.float(0, 1))
    ),
    uDisplacementAmplitude: gen.float(...VALID_RANGES.amplitude),
    uRoughness: gen.float(...VALID_RANGES.roughness),
    uClearcoat: gen.float(...VALID_RANGES.clearcoat),
    uClearcoatRoughness: gen.float(...VALID_RANGES.cc_roughness),
    uIridescence: gen.float(...VALID_RANGES.iridescence),
    uLineCount: gen.int(...VALID_RANGES.uLineCount),
    uNoiseOffset: getVector3(gen),
    uRoughnessPattern: gen.float(0, 1),
    uNoiseVariant: gen.float(0, 1),
    uStripesWidth: gen.float(...VALID_RANGES.uStripesWidth),
    uEmission: gen.float(0, 1),
  };
}
