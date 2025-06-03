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
