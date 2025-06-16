varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>

#define DIST_AMP 2.
#define SPEED .5
#define FREQ 1.
#define FRAC_SCALE 16.

//#include<random>
//#include<math>
//#include<noise3>
//#include<snoise>

//#include<line_functions>

vec3 calcNormalFromBump (in vec3 P0,
                         in float pattern,
                         in float t) {

  float rv0 = random(uSeed+12.0);
  float rv1 = random(uSeed+22.0);
  float rv2 = random(uSeed+32.0);
  float rv3 = random(uSeed+42.0);

  vec3 P1 = P0 + normalize(P0) * 0.01;

  float sim_amp = mix(rv0, 1.0, pattern);
  sim_amp *= 0.1 + rv3 * 0.5 ;
  float sim_freq = 0.3 + rv2 * 0.4;

  vec3 T = vec3(0.0, 0.0, t);
  vec3 F0 = P0 * sim_freq;
  vec3 F1 = P1 * sim_freq;

  P0 += vec3(
    snoise(F0 + 11.1 + T) * sim_amp,
    snoise(F0 + 22.2 + T) * sim_amp,
    snoise(F0 + 33.3 + T) * sim_amp
  ) * sim_amp;

  P1 += vec3(
    snoise(F1 + 11.1 + T) * sim_amp,
    snoise(F1 + 22.2 + T) * sim_amp,
    snoise(F1 + 33.3 + T) * sim_amp
  ) * sim_amp;

  return normalize(P1 - P0);
}

void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;

  float animation = uTime * SPEED;
  animation += sin(animation * 3.14 * 4.0) * 0.02;

  vec3 reppos = generateSyncedPosition(vPosition);

  vec3 pattern = drawSinLines(vec3(0.0, 0.0, 0.0), reppos, animation);
  pattern = smoothstep(0.2, 0.8, pattern * 0.5 + 0.5);

  vec3 mask = pattern * DIST_AMP * uDisplacementAmplitude;

  vec3 newPosition = vPosition + normal * mask;
  vDisplacement = mask.x;

  // vec3 newNormal = calcNormalFromBump(newPosition, mask.x, animation);
  // vNormal = normalize(mat3(projectionMatrix * modelViewMatrix) * normalMatrix  * -newNormal);
  // csm_Normal = vNormal;

  csm_Position = newPosition;
}