import { Environment, Float, Lightformer } from "@react-three/drei";
import { ENV_MAP_RESOLUTION } from "../constants";
import type { EnvironmentLightProps, LightPresetProps } from "../types";
import { LIGHT_PRESET } from "./lights";

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
