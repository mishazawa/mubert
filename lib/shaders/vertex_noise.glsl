uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

#define DIST_AMP .05
#define FREQ 1.0
#define SPEED 1.0

//#include<snoise>
//#include<noise3>

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;

  vec3 mask = DIST_AMP * turbulence(normal + uTime * SPEED, FREQ);
  
  vec3 newPosition = position + normal * mask;

  csm_Position = newPosition;
  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}