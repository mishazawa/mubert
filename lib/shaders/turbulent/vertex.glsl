varying vec2 vUv;
varying vec3 vPosition;

//#include<common_uniforms>

#define DIST_AMP .05
#define SPEED 1.0

//#include<snoise>
//#include<noise3>

vec3 displace (in vec3 P, in float animation) {
  vec3 mask = (DIST_AMP + uDisplacementAmplitude) * turbulence(uNoiseOffset + normal + uTime * SPEED, uDisplacementNoiseScale);
  
  return P + normal * mask;
}

//#include<calc_normal>

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  float animation = uTime * SPEED;
  vec3 newPosition = displace(position, animation);


  csm_Position = newPosition;
  csm_Normal = recalcNormals(csm_Position, animation);
}