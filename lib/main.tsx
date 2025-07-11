import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera as Camera,
  StatsGl,
} from "@react-three/drei";

import { Model } from "./components/Model";
import { EnvironmentLight } from "./components/EnvironmentLight";
import { AMBIENT_LIGHT_COLOR, VALID_RANGES } from "./constants";
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

      <EnvironmentLight intensity={10} />
      <Model {...props} />
      <LensCamera {...props.debug} />
      <OrbitControls enablePan={false} />
      <ambientLight color={AMBIENT_LIGHT_COLOR} intensity={10} />
    </Canvas>
  );
}

function LensCamera({ distance, lens }: any) {
  const cam = useRef<PerspectiveCamera>(null!);

  useEffect(() => {
    if (!cam.current) return;
    cam.current.setFocalLength(lens);
  }, [lens]);

  return <Camera ref={cam} position={[0, 0, distance]} makeDefault={true} />;
}

export function generateShaderParams(uSeed: number): ShaderControls {
  const gen = randomGenerator(uSeed);
  const palette = getColors(gen);
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
