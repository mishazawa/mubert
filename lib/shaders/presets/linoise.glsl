#define DIST_AMP .05
#define NOISE_DIST_AMP 1.
#define SPEED 1.
#define FREQ 1.
#define FRAC_SCALE 16

//#include<snoise>
//#include<noise3>
//#include<random>
//#include<noise_distortion>
//#include<math>
//#include<line_functions>

#ifdef VERTEX
#else
#endif

float gen_mask (vec2 uv, float animation) {
  return plot(fract(uv.x + animation), .1);
}

vec3 displace (in vec3 P, in vec3 N, in float animation) {
  vec3 mask = (DIST_AMP + uDisplacementAmplitude) * turbulence(uNoiseOffset + N + animation * SPEED, uDisplacementNoiseScale * uRMS);
  vec3 newPosition = P + N * mask ;
  return newPosition + noiseDistortion(newPosition, mask.x, animation) * (NOISE_DIST_AMP * uRMS) * gen_mask(vUv, animation);
}


DisplacePatternOutput displace_pattern(in DisplacePatternInput data, float animation) {
  vec3 newPosition = displace(data.position,data.normal, animation);
  return DisplacePatternOutput(newPosition, data.normal, vec3(0.));
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  vec3 key = vec3(uColorKeyValue);
  vec3 background = mix(uColor1, key, uUseColorKey);

  vec3 newColor = mix(background, uColor2, gen_mask(vUv, animation));
  return CoatOutput(newColor, data.normal, 1., uRoughness);
}
