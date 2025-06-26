//#include<math>
//#include<noise3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>

vec3 pattern_(in vec3 P, in float animation) {
  return drawAudioLines(vec3(0.0, 0.0, 0.0), generateSyncedPosition(P), animation) * DIST_AMP * uDisplacementAmplitude;
}

vec3 displace (in vec3 P, in vec3 N, in float animation) {

  vec3 mask = vec3(1.0);
  vec3 newPosition = P + N * mask;
  return newPosition + noiseDistortion(newPosition, mask.x, animation);
}

vec3 displace_ (in vec3 P, in vec3 N, in vec3 patt, in float animation) {

  // vec3 mask = smoothstep(0., 1., patt) ;
  vec3 mask = vec3(length(patt));
  vec3 newPosition = P + N * mask;
  mask = smoothstep(-1.0, 1.0, mask);
  return newPosition + noiseDistortion(newPosition*1.0, mask.x*1.0, animation*10.0);
}


//#include<calc_normal>

DisplacePatternOutput displace_pattern(in DisplacePatternInput data, float animation) {
  vec3 patt = pattern_(data.position, animation);
  vec3 p = displace_(data.position, data.normal, patt, animation);
  vec3 p_norm = displace_(data.position+data.normal*0.02, data.normal, patt, animation);
  vec3 n = normalize(p_norm - p);
  return DisplacePatternOutput(p, n, patt);
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  vec3 background = mix(uColor1, vec3(uColorKeyValue),  uUseColorKey);
  // vec3 reppos = generateSyncedPosition(vPosition);
  // vec3 newColor = drawSinLines(background, reppos, animation);
  // vec3 newColor = drawAudioLines(vec3(0.0, 0.0, 0.0), reppos, animation) * DIST_AMP * uDisplacementAmplitude;
  vec3 newColor = data.pattern;
  return CoatOutput(newColor, data.normal, 1., uRoughness);
}
