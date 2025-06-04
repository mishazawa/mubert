varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;


uniform float uTime;

#define FREQ 5.0

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
  coords.y += uTime;

  vec3 noisePattern = vec3(noise3(coords.xyzz ));
  float pattern = strips(noisePattern.y * FREQ);

  vDisplacement = pattern;

  float displacement = vDisplacement / 3.0;
  vec3 newPosition = position + normal * displacement;

  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}