#define DIST_AMP .05
#define NOISE_DIST_AMP 1.
#define SPEED 1.
#define FREQ 1.
#define FRAC_SCALE 16

//#include<random>
//#include<math>
//#include<noise3>
//#include<voronoi3>
//#include<line_functions>
//#include<noise_distortion>

vec3 displace(in vec3 P, in vec3 N, in float animation) {
  vec3 mask = (DIST_AMP + uDisplacementAmplitude) *
              turbulence(uNoiseOffset + N + animation, uDisplacementNoiseScale);
  vec3 newPosition = P + N * mask;
  return newPosition +
         noiseDistortion(newPosition, mask.x, animation) * NOISE_DIST_AMP;
}

//#include<calc_normal>

#ifdef VERTEX
#else
#endif

DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
                                       float animation) {
  vec3 p = displace(data.position, data.normal, animation);
  vec3 n = recalcNormals(p, data.position, data.normal, animation);
  return DisplacePatternOutput(p, n, vec3(0.));
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  vec3 key = vec3(uColorKeyValue);
  vec3 background = mix(uColor1, key, uUseColorKey);
  vec3 POS = normalize(data.position);
  vec3 newColor = maybeDrawLines(background, POS);

  return CoatOutput(newColor, data.normal, 1., uRoughness, uEmission,
                    uIridescence, 0.);
}
