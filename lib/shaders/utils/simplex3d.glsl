vec3 noise_3(vec4 pos) {
  return vec3(
    snoise(vec4(pos.x, pos.y, pos.z, pos.a*0.2+10.0)),
    snoise(vec4(pos.x, pos.y, pos.z, pos.a*0.2+20.0)),
    snoise(vec4(pos.x, pos.y, pos.z, pos.a*0.2+30.0))
  );
}
