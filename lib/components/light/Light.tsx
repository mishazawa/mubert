import { Environment, Float, Lightformer } from "@react-three/drei";
import type { ReactThreeFiber } from "@react-three/fiber";
import { ENV_MAP_RESOLUTION } from "../../constants";
import type { EnvironmentLightProps, LightPresetProps } from "../../types";
import { LIGHT_PRESET } from "./presets";
import { useParameters } from "../../hooks/useParameters";
import { useDebug } from "../../hooks/useDebug";

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
  const color = usePaletteAccentColor(!!props.isAccent);
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
                color={color}
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
          color={color}
        />
      </Float>
    );

  return (
    <Lightformer
      {...props}
      intensity={props.intensity * props.globalIntensity}
      color={color}
    />
  );
}

function usePaletteAccentColor(isAccent: boolean) {
  const ctx = useParameters();
  const lightAccent = useDebug("lightAccent", 0);

  if (!isAccent) return 0xffffff;

  return ctx.palette[lightAccent] as ReactThreeFiber.Color;
}
