vec3 noiseDistortion(in vec3 P, in float mask, in float animation) {
  const float SIN_FREQ = .75;
  float rv0 = random(uSeed+12.0);
  float rv3 = random(uSeed+42.0);
  vec3 PHASE = vec3(0.0, 0.0, animation);
  vec3 newPosition = P * SIN_FREQ;
  float sim_amp = mix(rv0, 1.0, mask ) * rv0 * rv3;

  return vec3(
      snoise(newPosition + 11.1 + PHASE),
      snoise(newPosition + 22.2 + PHASE),
      snoise(newPosition + 33.3 + PHASE)
    ) * sim_amp;
}