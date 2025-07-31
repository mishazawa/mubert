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
    <Scene seed={seed} getFFT={getFFT} getRMS={getRMS} />
  </>
)

```

#### API

```ts
interface Scene {
  seed: number;
  getFFT(): number[];
  getRMS(): number;
}
```

#### `getFFT` example

```ts
import { FFT_DATA_SIZE } from "mubert";

// audio analysis setup
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = ctx.createAnalyser();
analyser.fftSize = FFT_DATA_SIZE;
const fftData = new Uint8Array(analyser.frequencyBinCount);

function renderLoop() {
  if (audioReady) {
    analyser.getByteFrequencyData(fftData);
  }
  requestAnimationFrame(renderLoop);
}

renderLoop();

// function which is used by component
function getFFT() {
  return Array.from(fftData);
}
```

#### `getRMS` example

```ts
function getRMS() {
  const arr = fftData; // data from fft
  const sum = arr.reduce((acc: number, v: number) => acc + v, 0);
  return sum / arr.length / 255;
}
```
