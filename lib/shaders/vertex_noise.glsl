uniform float time;

varying vec2 vUv;
varying vec3 vPosition;

#define DIST_AMP .05
#define FREQ 1.0
#define SPEED 1.0

//#include<snoise>
//#include<noise3>

vec3 turbulence(vec3 p, float power) {
  vec3 t = vec3(-.5);

  for (float f = 1.0 ; f <= 2.0 ; f++ ){
    t += abs(noise3(vec4(vec3(p * power), 1.0)));
  }

  return t;
}

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;

  vec3 mask = DIST_AMP * turbulence(normal + time * SPEED, FREQ);
  
  vec3 newPosition = position + normal * mask;

  csm_Position = newPosition;
  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}