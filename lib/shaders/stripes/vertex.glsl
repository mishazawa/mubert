varying vec2 vUv;
varying vec3 vPosition;

//#include<common_uniforms>

#define DIST_AMP .05
#define NOISE_DIST_AMP .1
#define SPEED 1.0

//#include<snoise>
//#include<noise3>

//#include<random>
//#include<noise_distortion>

vec3 displace (in vec3 P, in float animation) {
  vec3 mask = (DIST_AMP + uDisplacementAmplitude) * turbulence(uNoiseOffset + normal + animation, uDisplacementNoiseScale);
  vec3 newPosition = P + normal * mask;
  return newPosition + noiseDistortion(newPosition, mask.x, animation) * NOISE_DIST_AMP;
}

//#include<calc_normal>

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  float animation = uTime * SPEED;
  vec3 newPosition = displace(position, animation);


  csm_Position = newPosition;
  csm_Normal = recalcNormals(csm_Position, animation);
}