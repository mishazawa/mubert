varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>

#define DIST_AMP .05
#define SPEED .5
#define FREQ 1.
#define FRAC_SCALE 16.

//#include<random>
//#include<math>
//#include<noise3>
//#include<snoise>

//#include<line_functions>




void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;

  float animation = uTime * SPEED;

  vec2 ps = ctos(vPosition);
  float reps = floor(mix(1.0, 12.0, uLineWidth));
  float rep_f = fract(ps.x*reps+animation*0.1/reps)/reps;
  rep_f = rep_f / reps;
  ps.x = rep_f;
  vec3 reppos = stoc(ps);
  // vPosition = reppos;

  float rv0 = random(uSeed+12.0);
  float rv1 = random(uSeed+22.0);
  float rv2 = random(uSeed+32.0);
  float rv3 = random(uSeed+42.0);

  // vec3 mask = (DIST_AMP + uDisplacementAmplitude) * turbulence(uNoiseOffset + normal + uTime * SPEED, uDisplacementNoiseScale);
  animation = animation + sin(animation*3.14*4.0)*0.02;
  vec3 nposition = vPosition.zyx + vNormal;
  vec3 pattern = maybeDrawLines2(vec3(0.0, 0.0, 0.0), reppos.xyz, animation);
  vec3 mask = pattern*rv0;
  // mask = smoothstep(0.0, 1.0, mask);
  vec3 newPosition = vPosition + normal * (mask);

  float sin_amp = mix(0.0, 1.0, length(pattern));
  float sin_freq = 0.75;
  float t = animation;
  vec3 newPosition2 = newPosition+normalize(newPosition)*0.01;
  // for (int i = 0; i < 8; i++) {
  //   newPosition2 = sinnoise_distort(newPosition+normalize(newPosition)*0.1, sin_amp, sin_freq, vec3(0.0, 0.0, t));
  //   newPosition = sinnoise_distort(newPosition, sin_amp, sin_freq, vec3(0.0, 0.0, t));
  // }
  float sim_amp = mix(rv0, 1.0, pattern.x);
  sim_amp *= 0.1+rv3*0.5;
  float sim_freq = 0.3+rv2*0.4;
  for (int i = 0; i < 1; i++) {
    newPosition2 = newPosition2+
    vec3(
      snoise(newPosition2*sim_freq+11.1+vec3(0.0, 0.0, t))*sim_amp,
      snoise(newPosition2*sim_freq+22.2+vec3(0.0, 0.0, t))*sim_amp,
      snoise(newPosition2*sim_freq+33.3+vec3(0.0, 0.0, t))*sim_amp
    )*sim_amp;
    newPosition = newPosition+    
    vec3(
      snoise(newPosition*sim_freq+11.1+vec3(0.0, 0.0, t))*sim_amp,
      snoise(newPosition*sim_freq+22.2+vec3(0.0, 0.0, t))*sim_amp,
      snoise(newPosition*sim_freq+33.3+vec3(0.0, 0.0, t))*sim_amp
    )*sim_amp;
  }

  // vec2 newPositionS = ctos(newPosition);
  // newPositionS.x += rep_uv;
  // newPosition = stoc(newPositionS);

  // vec2 newPosition2S = ctos(newPosition2);
  // newPosition2S.x += rep_uv;
  // newPosition2 = stoc(newPosition2S);


  vPosition = position;

  vec3 new_normal = normalize(newPosition2-newPosition);

  // vNormal = mat3(projectionMatrix * modelViewMatrix) * normalMatrix * new_normal;
  vNormal = mat3(projectionMatrix * modelViewMatrix) * normalMatrix * new_normal;

  vDisplacement = mask.x;
  // vec3 displacedNormal = normalize(cross(dFdx(newPosition), dFdy(newPosition)));
  // vNormal = displacedNormal;
  // csm_Normal = mat3(projectionMatrix * modelViewMatrix) * normalMatrix * normal;
  csm_Normal = new_normal;

  csm_Position = newPosition;
  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}