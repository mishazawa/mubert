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
const ref = useRef(generateShaderParams(SEED));
return (
  <>
    <Scene data={ref}/>
  </>
)

```
