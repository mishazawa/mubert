varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#define SPEED 1.
#define NOISE_DIST_AMP 1.
#define DIST_AMP .05
//#include<common_uniforms>

//#include<snoise>
//#include<noise3>
//#include<random>
//#include<noise_distortion>
vec3 displace (in vec3 P, in float animation) {
  vec3 mask = (DIST_AMP + uDisplacementAmplitude) * turbulence(uNoiseOffset + normal + uTime * SPEED, uDisplacementNoiseScale);
  
  vec3 newPosition = P + normal * mask;
  return newPosition + noiseDistortion(newPosition, mask.x, animation) * NOISE_DIST_AMP;
}

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  float animation = uTime * SPEED;
  vec3 newPosition = displace(position, animation);

  csm_Position = newPosition;

}