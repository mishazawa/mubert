//#include<math>
//#include<noise3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>

vec3 displace (in vec3 P, in vec3 N, in float animation) {
  vec3 mask = drawSinLines(vec3(0.0, 0.0, 0.0), generateSyncedPosition(P), animation) * DIST_AMP * uDisplacementAmplitude;
  mask = smoothstep(0., 1., mask) ;
  vec3 newPosition = P + N * mask;
  return newPosition + noiseDistortion(newPosition, mask.x, animation);
}

//#include<calc_normal>

DisplacePatternOutput displace_pattern(in DisplacePatternInput data, float animation) {
  float t = animation + sin(animation * 3.14 * 4.0) * 0.02;
  vec3 p = displace(data.position, data.normal, t);
  vec3 n = recalcNormals(p, data.position, data.normal, t);
  return DisplacePatternOutput(p, n, vec3(0.));
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  vec3 background = mix(uColor1, vec3(uColorKeyValue),  uUseColorKey);
  vec3 reppos = generateSyncedPosition(vPosition);
  vec3 newColor = drawSinLines(background, reppos, animation);
  return CoatOutput(newColor, data.normal, 1., uRoughness);
}
