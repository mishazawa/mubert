varying vec2 vUv;
varying vec3 vPosition;

//#include<common_uniforms>

#define DIST_AMP 5.
#define SPEED .5
#define FREQ .5
#define FRAC_SCALE 16.


//#include<math>
//#include<noise3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>

vec3 displace (in vec3 P, in float animation) {
  vec3 mask = drawSinLines(vec3(0.0, 0.0, 0.0), generateSyncedPosition(P), animation) * DIST_AMP * uDisplacementAmplitude;
  mask = smoothstep(0., 1., mask) ;
  vec3 newPosition = P + normal * mask;
  return newPosition + noiseDistortion(newPosition, mask.x, animation);
}


//#include<calc_normal>


void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  float animation = uTime * SPEED;
  animation += sin(animation * 3.14 * 4.0) * 0.02;

  vec3 newPosition = displace(vPosition, animation);


  csm_Position = newPosition;
  csm_Normal = recalcNormals(csm_Position, animation);
}