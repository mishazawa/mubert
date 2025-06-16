varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>

#define SPEED .5
#define FREQ 1.
#define FRAC_SCALE 16.

//#include<random>
//#include<math>
//#include<noise3>
//#include<snoise>
//#include<voronoi3>
//#include<calc_bump>
//#include<line_functions>



void main() {
  vec3 key = vec3(uColorKeyValue);

  vec3 background = mix(uColor1, key,  uUseColorKey);
  vec3 newColor = background;

  float animation = uTime * SPEED;

  vec3 reppos = generateSyncedPosition(vPosition);

  animation = animation + sin(animation*3.14*4.0)*0.02;
  vec3 noiseSeed = uNoiseOffset + reppos;

  newColor = drawSinLines(background, reppos, animation);

  float noisePattern = snoise(noiseSeed + newColor + vec3(0.0, 0.0, animation));
  noisePattern = smoothstep(0.2, 0.8, noisePattern * 0.5 + 0.5);
  float pattern = noisePattern;

  // Debug
  // pattern = 0.0;
  // newColor = mix(background, newColor, pattern);

  //#include<common_standard_props>
  csm_Roughness = mix(uRoughness, 1. - uRoughness, pattern * uRoughnessPattern);
  csm_DiffuseColor.rgba = vec4(newColor, 1.0);



}