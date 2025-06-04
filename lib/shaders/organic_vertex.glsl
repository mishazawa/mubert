varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;
varying vec3 vDispPosition;


uniform float uTime;

#define FREQ 5.0
#define SPEED 1.0

//#include<math>
//#include<snoise>
//#include<noise3>

float strips(float position) {
  return fit(smoothMod(position, 1.0, 1.5), 0.35, 0.6, 0.0, 1.0);
}



void main() {
  // varyings
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  vec3 coords = normal;
  coords.y += uTime * SPEED;

  vec3 noisePattern = vec3(noise3(coords.xyzz) * .25);
  float pattern = strips(noisePattern.y * FREQ);
  float displacement = clamp(pattern, 0.2, .8) * .3;

  vDisplacement = displacement;

  vec3 newPosition = position + normal * displacement;
  //newPosition += noisePattern * .2;
  vDispPosition = newPosition;

  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}