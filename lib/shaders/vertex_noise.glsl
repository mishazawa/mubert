varying vec2 vUv;
uniform float time;

#define DIST_AMP .15
#define FREQ 2.0
#define SPEED 1.0

//#include<pnoise>

float turbulence( vec3 p, float power) {
  float t = -.5;

  for (float f = 1.0 ; f <= 2.0 ; f++ ){
    t += abs( pnoise( vec3( power * p ), vec3( 10.0 ) ) / power );
  }

  return t;

}

void main() {
  vUv = uv;

  float mask = turbulence(normal + time * SPEED, FREQ);

  float noise = DIST_AMP * mask;
  
  vec3 newPosition = position + normal * noise;

  csm_Position = newPosition;
  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}