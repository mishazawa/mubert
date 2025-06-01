### Run

```bash
npm i
# or
yarn
```

```bash
npm run dev
# or
yarn dev
```

### Change

`src/app/components/Canvas` - scene setup

`src/app/components/Model` - model and animation

`src/app/components/PostFx` - post processing passes

`src/app/components/generativeShader` - shader setup for js

`src/app/shader/` - folder for shaders

`src/app/effects/` - folder for post efffects

### API model

`useTransforms()` - hook for mesh animation

`useUniforms()` - hook for animating uniforms

`type GenerativeShaderUniforms` - type for uniforms

`type AnalysisData` - type for audio data

`useUpdateAnalysisData()` - hook for setting audio data. used for updating time, fft, etc.

`useInitAnalyser()` - creates audio context from html audio source

`useAudioData(audio) -> data` - wrapper for audio stuff. returns reference to `AnalysisData`

### API postfx

Just copy blur effect and make similar. Add to render queue.
