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

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
  : vec3(0.0, -v.z, v.y));
}

vec3 recalcNormals(in vec3 newPos, in vec3 P, in vec3 N, float animation) {
  float offset = 0.001;
  vec3 tangent = orthogonal(N);
  vec3 bitangent = normalize(cross(N, tangent));
  vec3 neighbour1 = P + tangent * offset;
  vec3 neighbour2 = P + bitangent * offset;

  vec3 displacedNeighbour1 = displace(neighbour1, N, animation);
  vec3 displacedNeighbour2 = displace(neighbour2, N, animation);

  vec3 displacedTangent = displacedNeighbour1 - newPos;
  vec3 displacedBitangent = displacedNeighbour2 - newPos;

  return normalize(cross(displacedTangent, displacedBitangent));
}

DisplacePatternOutput displace_pattern(in DisplacePatternInput data, float animation) {
  float t = animation + sin(animation * 3.14 * 4.0) * 0.02;
  vec3 p = displace(data.position, data.normal, t);
  vec3 n = recalcNormals(p, data.position, data.normal, t);
  return DisplacePatternOutput(p, n, vec3(0.));
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  vec3 background = mix(uColor1, vec3(uColorKeyValue),  uUseColorKey);
  vec3 reppos = stoc(ctos(data.position)) * fit(uDisplacementNoiseScale, 0.01, 2.0, 1., 4.);
  vec3 newColor = drawSinLines(background, reppos, animation);
  return CoatOutput(newColor, data.normal, 1., uRoughness);
}
