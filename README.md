### Run

```bash
npm i
```

```bash
npm run dev
```

### Structure

`lib/main` - scene setup

`lib/components/Model` - model and animation

`lib/components/PostFx` - post processing passes

`lib/components/generativeShader` - shader setup for js

`lib/shaders/` - folder for shaders

`lib/effects/` - folder for post efffects

`src` - folder for development

### API model

`useTransforms()` - hook for mesh animation

`useUniforms()` - hook for animating uniforms

`type GenerativeShaderUniforms` - type for uniforms

### API postfx

Just copy blur effect and make similar. Add to render queue.

### Glsl

```js
// import
#pragma glslify: snoise = require(./utils/simplex4d.glsl)

// pass reference
// https://github.com/glslify/glslify?tab=readme-ov-file#passing-references-between-modules
#pragma glslify: pattern = require(./utils/pattern.glsl, snoise=snoise)

// export
#pragma glslify: export(pattern)
```

### Building and usage as component

```bash
npm run build
```

```bash
npm link
```

cd to destination directory

```bash
npm link mubert -S
```

```jsx
import Scene from "mubert"

...

return (
  <>
    <Scene {...props}/>
  </>
)

```
