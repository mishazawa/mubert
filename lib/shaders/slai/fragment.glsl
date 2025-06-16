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

  vec3 POS = normalize(vPosition);
  float animation = uTime * SPEED;

  vec2 ps = ctos(vPosition);
  float reps = floor(mix(1.0, 12.0, uLineWidth));
  float rep_f = fract(ps.x*reps+animation*0.1/reps)/reps;
  rep_f = rep_f / reps;
  ps.x = rep_f;
  vec3 reppos = stoc(ps);
  POS = reppos;


  animation = animation + sin(animation*3.14*4.0)*0.02;
  vec3 noiseSeed = uNoiseOffset + POS;



  newColor = maybeDrawLines2(background, POS, animation);
  // vec3 noiseVal = mix(voronoi3d(noiseSeed+newColor), noise3(noiseSeed+newColor, animation), uNoiseVariant);
  float noisePattern = snoise(noiseSeed+newColor+vec3(0.0,0.0,animation));
  noisePattern = smoothstep(0.2, 0.8, noisePattern*0.5+0.5);
  float pattern = noisePattern;

  // Debug
  // pattern = 0.0;

  // newColor = mix(background, newColor, pattern);

  //#include<common_standard_props>
  csm_Roughness = mix(uRoughness, 1. - uRoughness, pattern * uRoughnessPattern);

  // csm_Normal = vec3(0.0, 1.0, 0.0);
  csm_DiffuseColor.rgba = vec4(newColor, 1.0);



}