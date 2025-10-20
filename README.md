### Usage

#### Building

1. Clone repository

2. Build the bundle

```bash
npm run build:lib                   # ignore demo app

```

3. Link to host application via npm

```bash
npm link
cd path/to/host/app
npm link mubert -S
```

#### Usage

```jsx
import Scene from "mubert"

...

const seed = 1;

return (
  <>
    <Scene seed={seed} getFFT={getFFT} getRMS={getRMS} texture={URL}/>
  </>
)

```

#### API

```ts
interface Scene {
  seed: number;
  getFFT(): number[];
  getRMS(): number;

  // mesh resolution. used for fine tune performance
  resolution?: number;
  // device pixel ratio. default = 1
  dpr?: 1 | 2;

  // switch between texture and palette
  useTex?: boolean;
  // URL for texture
  texture?: string;
  // custom colors as hex strings, f.e. #ff00ff
  customPalette?: CustomPalette;

  // smooth fft range [attack, release]. default = [.4, .1]
  smoothFFT?: [number, number];
  // smooth rms range [attack, release]. default = [.5, .5]
  smoothRMS?: [number, number];
  // RMS speed multiplier. default = .2
  rmsSpeed?: number;
}

type CustomPalette = [string, string, string, string, string];
```
