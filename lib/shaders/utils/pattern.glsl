float pattern(vec3 pos, float time) {
  float nscale = 1.0;

  vec3 noise3 = vec3(
    snoise(vec4(pos.x, pos.y, pos.z, time*0.2+10.0)),
    snoise(vec4(pos.x, pos.y, pos.z, time*0.2+20.0)),
    snoise(vec4(pos.x, pos.y, pos.z, time*0.2+30.0))
  );

  vec4 npos = vec4((pos + noise3*0.5)*nscale, time*0.2);
  float noise = snoise(npos);

  return noise;
}

#pragma glslify: export(pattern)