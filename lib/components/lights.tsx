import type { LightPresetProps } from "../types";

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
      isAccent: true,
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
  // gpt...
  [
    {
      intensity: 1.5,
      position: [0, 10, 0],
      scale: [15, 0.5, 15],
      form: "circle",
    },
    {
      intensity: 1,
      position: [-10, 5, 0],
      scale: [5, 5, 1],
      form: "circle",
    },
    {
      intensity: 1,
      position: [10, 5, 0],
      scale: [5, 5, 1],
      form: "circle",
    },
  ],
  [
    {
      intensity: 3,
      position: [0, 15, 0],
      scale: [5, 10, 1],
      rotation: [-Math.PI / 3, 0, 0],
    },
    {
      intensity: 1,
      position: [5, 10, -5],
      scale: [3, 5, 1],
      rotation: [-Math.PI / 4, Math.PI / 6, 0],
      form: "circle",
    },
    {
      intensity: 1,
      position: [-5, 10, -5],
      scale: [3, 5, 1],
      rotation: [-Math.PI / 4, -Math.PI / 6, 0],
      form: "circle",
    },
  ],
  [
    {
      group: true,
      children: new Array(6).fill(0).map((_, i) => ({
        intensity: 1.2,
        position: [0, 2, i * 5 - 10],
        scale: [8, 0.2, 1],
        rotation: [Math.PI / 2, 0, 0],
        form: "circle",
      })),
    },
  ],
  [
    {
      float: true,
      form: "ring",
      color: "blue",
      intensity: 2,
      position: [5, 4, -5],
      scale: [8, 8, 1],
      floatProps: {
        speed: 2,
        floatIntensity: 1.5,
        rotationIntensity: 1,
      },
    },
    {
      float: true,
      form: "ring",
      color: "green",
      intensity: 2,
      position: [-5, 4, 5],
      scale: [8, 8, 1],
      floatProps: {
        speed: 3,
        floatIntensity: 2,
        rotationIntensity: 1.2,
      },
    },
  ],
  [
    {
      intensity: 4,
      position: [0, 3, -10],
      rotation: [0, 0, 0],
      scale: [20, 5, 1],
      form: "circle",
    },
    {
      intensity: 0.5,
      position: [0, 6, 6],
      scale: [6, 6, 1],
      form: "circle",
    },
  ],
  // gpt goes wild
  [
    {
      group: true,
      rotation: [0, 0, 0],
      children: new Array(6).fill(0).map((_, i) => ({
        form: "ring",
        color: i % 2 === 0 ? "magenta" : "cyan",
        intensity: 2.5,
        position: [0, 2, i * 5 - 15],
        scale: [6, 6, 1],
      })),
    },
  ],
  [
    {
      float: true,
      form: "circle",
      color: "hotpink",
      intensity: 2,
      position: [-8, 4, -4],
      scale: [3, 1.5, 1],
      floatProps: {
        speed: 3,
        floatIntensity: 1,
        rotationIntensity: 2,
      },
    },
    {
      float: true,
      form: "rect",
      color: "deepskyblue",
      intensity: 2,
      position: [8, 4, -4],
      scale: [3, 1.5, 1],
      floatProps: {
        speed: 2,
        floatIntensity: 1.5,
        rotationIntensity: 2.5,
      },
    },
  ],
  [
    {
      intensity: 3,
      position: [5, 2, 0],
      scale: [10, 0.5, 1],
      rotation: [0, 0, 0],
      form: "circle",
      color: "purple",
    },
    {
      intensity: 2,
      position: [-5, 2, 0],
      scale: [10, 0.5, 1],
      rotation: [0, 0, 0],
      form: "circle",
      color: "blue",
    },
    {
      intensity: 1.5,
      position: [0, 6, -5],
      scale: [5, 1, 1],
      form: "rect",
      color: "red",
    },
  ],
  [
    {
      form: "circle",
      intensity: 3,
      position: [0, 6, 0],
      scale: [8, 8, 1],
      color: "fuchsia",
      float: true,
      floatProps: {
        speed: 4,
        floatIntensity: 2.5,
        rotationIntensity: 3,
      },
    },
    {
      form: "rect",
      intensity: 2,
      position: [0, 2, 8],
      rotation: [Math.PI / 4, 0, 0],
      scale: [10, 1, 1],
      color: "lime",
    },
  ],
  [
    {
      group: true,
      rotation: [0, 0, 0],
      children: [...Array(4)].flatMap((_, row) =>
        [...Array(4)].map((_, col) => ({
          intensity: 1.8,
          form: "rect",
          color: col % 2 === 0 ? "aqua" : "magenta",
          position: [-6 + col * 4, 1.5, -10 + row * 4],
          scale: [2, 0.1, 2],
        }))
      ),
    },
  ],
  //
  [
    {
      intensity: 2,
      position: [4, 5, 5],
      rotation: [0, -0.5, 0],
      scale: [4, 4, 1],
      form: "rect",
      color: "white", // Key Light
    },
    {
      intensity: 1,
      position: [-4, 3, 5],
      rotation: [0, 0.3, 0],
      scale: [3, 3, 1],
      form: "rect",
      color: "white", // Fill Light
    },
    {
      intensity: 1.2,
      position: [0, 5, -5],
      rotation: [0, 0, 0],
      scale: [3, 3, 1],
      form: "circle",
      color: "white", // Rim Light
    },
  ],
  [
    {
      intensity: 2,
      position: [0, 8, 0],
      scale: [10, 1, 10],
      rotation: [Math.PI / 2, 0, 0],
      form: "rect",
      color: "white",
    },
    {
      intensity: 0.5,
      position: [0, 2, 5],
      scale: [5, 1, 1],
      form: "circle",
      color: "white",
    },
  ],
  [
    {
      intensity: 1.8,
      position: [3, 4, 4],
      scale: [4, 3, 1],
      form: "rect",
      color: "yellow",
    },
    {
      intensity: 0.6,
      position: [-2, 3, 6],
      scale: [3, 2, 1],
      form: "circle",
      color: "white",
    },
    {
      intensity: 0.3,
      position: [0, 5, -4],
      rotation: [0, 0, 0],
      scale: [2, 2, 1],
      form: "circle",
      color: "white",
    },
  ],
  [
    {
      intensity: 2.5,
      position: [0, 5, 5],
      scale: [4, 4, 1],
      form: "rect",
      color: "white",
    },
    {
      intensity: 2,
      position: [0, 5, -5],
      scale: [4, 4, 1],
      form: "rect",
      color: "white",
    },
    {
      intensity: 1.5,
      position: [5, 5, 0],
      rotation: [0, -Math.PI / 2, 0],
      scale: [4, 4, 1],
      form: "rect",
      color: "white",
    },
    {
      intensity: 1.5,
      position: [-5, 5, 0],
      rotation: [0, Math.PI / 2, 0],
      scale: [4, 4, 1],
      form: "rect",
      color: "white",
    },
  ],
  [
    {
      intensity: 1.8,
      position: [-3, 5, 5],
      rotation: [0, 0.3, 0],
      scale: [3, 3, 1],
      form: "circle",
      color: "white",
    },
    {
      intensity: 1.8,
      position: [3, 5, 5],
      rotation: [0, -0.3, 0],
      scale: [3, 3, 1],
      form: "circle",
      color: "white",
    },
    {
      intensity: 0.5,
      position: [0, 8, 0],
      scale: [6, 0.5, 6],
      form: "rect",
      rotation: [Math.PI / 2, 0, 0],
      color: "white",
    },
  ],
];
