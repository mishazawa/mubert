### Run

```bash
npm i
```

```bash
npm run dev
```

### Structure

`src` - demo/dev app

`lib/main` - scene setup

`lib/components/Model` - model and animation

`lib/components/PostFx` - post processing passes

`lib/components/EnvironmentLight` - scene light setup. can be animated

`lib/effects/` - folder for post efffects

`lib/shaders/` - folder for shaders

`lib/shaders/compiler.tsx` - shader concatenation (see below)

### Shaders

#### How to create shader

1. Place shaders into separate directory

2. In file `shaders/compiler.tsx` import vert and frag files (`?raw` mark)

3. Add new entry into `SHADER_BUNDLE` map with format `<shader_name>: [<vert>, <frag>]`

4. In file `components/Model.tsx` change line `const [vertexShader, fragmentShader] = useMemo(() => compile(<shader_name>), []);` to your `<shader_name>`

#### How to create imports chunks

1. Place shader chunk into directory f.e. `utils`

2. In file `shaders/compiler.tsx` import file (`?raw` mark)

3. Add new entry into `INCLUDE_MAP` map with format `"//#include<NAME>": <IMPORTED_FILE>`

4. In shader code add `//#include<NAME>` with your `<NAME>`

5. **Do not import anything inside chunks**.

#### How to add uniforms

1. In file `types.ts` add new entry to `GenerativeShaderUniforms` with format
   `readonly uNAME: UniformValue<TYPE>;`

2. In file `shaders/common/uniforms.glsl` declare uniform

3. In file `main.tsx` add uniform to parameter generator.

4. To animate uniforms: in file `components/Model.tsx` add assignment with your uniform to the hook `useUniforms` like this:

```tsx
function useUniforms(
...
  // animate uniforms here
  useFrame(() => {
    uniforms.current.uNAME.value = controls.current.uNAME;
...

```

5. Follow errors

6. To add uniform to UI check `src/App.tsx` and follow example of other parameters in `useUiParams` hook.

### API model

`useTransforms()` - hook for mesh animation

`useUniforms()` - hook for animating uniforms

`type GenerativeShaderUniforms` - type for uniforms

### API postfx

Just copy blur effect and make similar. Add to render queue.

### Building and usage as component

```bash
npm run build:all
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
const ref = useRef(generateShaderParams(SEED));
return (
  <>
    <Scene data={ref}/>
  </>
)

```
