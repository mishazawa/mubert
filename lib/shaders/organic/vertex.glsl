varying vec2 vUv;
varying vec3 vPosition;

//#include<common_uniforms>

#define FREQ 5.0
#define SPEED .5

//#include<math>
//#include<snoise>
//#include<noise3>

float strips(float position) {
  return fit(smoothMod(position, 1.0, 1.5), 0.35, 0.6, 0.0, .5);
}

vec3 displace (in vec3 P, in float animation) {
  vec3 coords = normal + animation;
  vec3 noiseMask = noise3(uNoiseOffset + vPosition,  - animation * 0.1) * 1.5;
  vec3 noisePattern = noise3(uNoiseOffset + coords * vec3(uDisplacementNoiseScale), 0.1);
  float pattern = strips(noisePattern.y * FREQ);

  float mask = mix(pattern, uDisplacementAmplitude * .5, smoothstep(.4, .6, noiseMask.x)) * uDisplacementAmplitude;
  return P + normal * mask;
}

//#include<calc_normal>

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  float animation = uTime * SPEED;
  vec3 newPosition = displace(vPosition, animation);

  csm_Position = newPosition;
  csm_Normal = recalcNormals(csm_Position, animation);

}