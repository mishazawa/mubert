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
