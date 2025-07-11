import { Environment, Float, Lightformer } from "@react-three/drei";
import { ENV_MAP_RESOLUTION } from "../constants";
import type { EnvironmentLightProps } from "../types";

type LightPresetProps = {
  position?: [number, number, number];
  scale?: [number, number, number];
  group?: boolean;
  float?: boolean;
};

export const LIGHT_PRESET: Array<
  Array<LightPresetProps & { [key: string]: any }>
> = [
  [
    { intensity: 1, position: [5, 5, 5], scale: [5, 10, 1] },
    {
      intensity: 2,
      position: [-15, -5, 5],
      scale: [10, 10, 1],
      form: "circle",
    },
  ],
  [
    {
      intensity: 0.75,
      rotation: [Math.PI / 2, 0, 0],
      position: [0, 5, -9],
      scale: [10, 10, 1],
    },
    {
      group: true,
      rotation: [0, 0.5, 0],
      children: [2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => ({
        form: "circle",
        intensity: 2,
        rotation: [Math.PI / 2, 0, 0],
        position: [x, 4, i * 4],
        scale: [3, 1, 1],
      })),
    },
    {
      intensity: 4,
      rotation: [0, Math.PI / 2, 0],
      position: [5, 1, -1],
      scale: [20, 0.1, 1],
    },
    {
      intensity: 1,
      rotation: [0, Math.PI / 2, 0],
      position: [-5, -1, -1],
      scale: [20, 0.5, 1],
    },
    {
      intensity: 1,
      rotation: [0, -Math.PI / 2, 0],
      position: [10, 1, 0],
      scale: [20, 1, 1],
    },
    {
      form: "ring",
      color: "red",
      intensity: 1,
      scale: [10, 10, 10],
      position: [-15, 4, -18],
      target: [0, 0, 0],
      float: true,
      floatProps: {
        speed: 5,
        floatIntensity: 2,
        rotationIntensity: 2,
      },
    },
  ],
];

export function EnvironmentLight({
  intensity,
  preset = 0,
}: EnvironmentLightProps) {
  return (
    <Environment resolution={ENV_MAP_RESOLUTION}>
      {LIGHT_PRESET[Math.min(preset, LIGHT_PRESET.length - 1)].map((l, idx) => (
        <RenderLight key={idx} {...l} globalIntensity={intensity} />
      ))}
    </Environment>
  );
}

function RenderLight(props: LightPresetProps & { [key: string]: any }) {
  if (props.group)
    return (
      <group {...props}>
        <group>
          {props.children.map(
            (elem: LightPresetProps & { [key: string]: any }, idx: number) => (
              <Lightformer
                {...elem}
                key={idx}
                intensity={elem.intensity * props.globalIntensity}
              />
            )
          )}
        </group>
      </group>
    );

  if (props.float)
    return (
      <Float {...props.floatProps}>
        <Lightformer
          {...props}
          intensity={props.intensity * props.globalIntensity}
        />
      </Float>
    );

  return (
    <Lightformer
      {...props}
      intensity={props.intensity * props.globalIntensity}
    />
  );
}
