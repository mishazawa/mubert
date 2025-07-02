#define DIST_AMP 5.
#define NOISE_DIST_AMP 1.
#define SPEED .1
#define FREQ 1.
#define FRAC_SCALE 16

//#include<math>
//#include<noise3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>



vec3 pattern_(in vec3 P, in float animation) {
  return drawAudioLines(vec3(.0), generateSyncedPosition(P), animation) * DIST_AMP * uDisplacementAmplitude;
}

vec3 displace (in vec3 P, in vec3 N, in float animation) {
  vec3 mask = vec3(1.0);
  vec3 newPosition = P + N * mask;
  return newPosition + noiseDistortion(newPosition, mask.x, animation);
}

vec3 displace (in vec3 P, in vec3 N, in vec3 patt, in float animation) {
  vec3 mask = vec3(length(patt));
  vec3 newPosition = P + N * mask;
  mask = smoothstep(-1.0, 1.0, mask);

  return newPosition + noiseDistortion(newPosition, mask.x, animation * 10.0);
  
}


//#include<calc_normal>


DisplacePatternOutput displace_pattern(in DisplacePatternInput data, float animation) {
  Neighbours samples = getNeighbours(data.position, data.normal);

  vec3 patt = pattern_(data.position, animation);
  vec3 p = displace(data.position, data.normal, patt, animation);
  
  vec3 n = calcNormalFromSamples(
    p,
    displace(samples.a, data.normal, patt, animation),
    displace(samples.b, data.normal, patt, animation)
  );
  
  // return DisplacePatternOutput(data.position, data.normal, patt);
  return DisplacePatternOutput(p, n, patt);
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  vec3 background = mix(uColor1, vec3(uColorKeyValue),  uUseColorKey);
  // vec3 newColor = mix(background, uColor2,  data.pattern);
  vec3 newColor = data.pattern;
  return CoatOutput(newColor, data.normal, 1., uRoughness);
}
