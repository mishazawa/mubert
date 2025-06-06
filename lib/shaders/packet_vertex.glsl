varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;



uniform float uTime;

#define FREQ 5.0
#define SPEED 1.0

//#include<math>
//#include<snoise>
//#include<noise3>
//#include<voronoi3>



void main() {
  // varyings
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  vec3 coords = normal;
  coords.y += uTime * SPEED;

  float displacement = smoothstep(0., .99, 1. - voronoi2d(uv * 10.)) - .5;


  vDisplacement = .1 * displacement;

  vec3 newPosition = vPosition + vNormal * vDisplacement ;

  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}