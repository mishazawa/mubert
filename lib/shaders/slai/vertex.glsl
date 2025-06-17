varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>

#define DIST_AMP 10.
#define SPEED .5
#define FREQ 1.
#define FRAC_SCALE 16.

//#include<random>
//#include<math>
//#include<noise3>
//#include<snoise>

//#include<line_functions>

vec3 displace (in vec3 P, in float animation) {
  vec3 mask = drawSinLines(vec3(0.0, 0.0, 0.0), generateSyncedPosition(P), animation) * DIST_AMP * uDisplacementAmplitude;
  mask = smoothstep(0., 1., mask);
  return P + normal * mask;
}


vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
  : vec3(0.0, -v.z, v.y));
}

vec3 recalcNormals(vec3 newPos, float animation) {
  float offset = 0.001;
  vec3 tangent = orthogonal(normal);
  vec3 bitangent = normalize(cross(normal, tangent));
  vec3 neighbour1 = position + tangent * offset;
  vec3 neighbour2 = position + bitangent * offset;

  vec3 displacedNeighbour1 = displace(neighbour1, animation);
  vec3 displacedNeighbour2 = displace(neighbour2, animation);

  vec3 displacedTangent = displacedNeighbour1 - newPos;
  vec3 displacedBitangent = displacedNeighbour2 - newPos;

  return normalize(cross(displacedTangent, displacedBitangent));
}

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  float animation = uTime * SPEED;
  animation += sin(animation * 3.14 * 4.0) * 0.02;

  vec3 newPosition = displace(vPosition, animation);
  vDisplacement = 0.;

  csm_Position = newPosition;
  csm_Normal = recalcNormals(csm_Position, animation);
}