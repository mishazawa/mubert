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
  return plot(fract(uv.x + animation * .5), .1);
}

vec3 displace (in vec3 P, in vec3 N, in float animation) {
  vec3 mask = (DIST_AMP + uDisplacementAmplitude) * turbulence(uNoiseOffset + N + animation * SPEED, uDisplacementNoiseScale);
  vec3 newPosition = P + N * mask ;
  return newPosition + noiseDistortion(newPosition, mask.x, animation) * NOISE_DIST_AMP * gen_mask(vUv, animation);
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
