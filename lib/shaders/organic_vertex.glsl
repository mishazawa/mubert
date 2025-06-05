varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;



uniform float uTime;

#define FREQ 5.0
#define SPEED .5

//#include<math>
//#include<snoise>
//#include<noise3>

float strips(float position) {
  return fit(smoothMod(position, 1.0, 1.5), 0.35, 0.6, 0.0, .5);
}

void main() {
  // varyings
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  float animation = uTime * SPEED;

  vec3 coords = normal;
  coords += animation;
  vec3 noiseMask = noise3(vec4(vPosition - animation * 0.1, 1.)) * 1.5;

  vec3 noisePattern = noise3(vec4(coords* vec3(1., .01, 1.), 1.));
  float pattern = strips(noisePattern.y * FREQ);
  //float pattern = strips(noiseMask.x);
  float displacement = mix(pattern, .0, smoothstep(.4, .6, noiseMask.x)) * .1;

  vDisplacement = displacement;

  vec3 newPosition = vPosition + vNormal * vDisplacement ;

  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}