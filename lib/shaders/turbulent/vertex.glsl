varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>

#define DIST_AMP .05
#define SPEED 1.0

//#include<snoise>
//#include<noise3>

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  vec3 mask = (DIST_AMP + uDisplacementAmplitude) * turbulence(uNoiseOffset + normal + uTime * SPEED, uDisplacementNoiseScale);
  
  vec3 newPosition = position + normal * mask;

  vDisplacement = mask.x;

  csm_Position = newPosition;
  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}