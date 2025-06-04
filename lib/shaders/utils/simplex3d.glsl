vec3 noise3(vec4 pos) {
  return vec3(
    snoise(vec4(pos.x, pos.y, pos.z, pos.a*0.2+10.0)),
    snoise(vec4(pos.x, pos.y, pos.z, pos.a*0.2+20.0)),
    snoise(vec4(pos.x, pos.y, pos.z, pos.a*0.2+30.0))
  );
}

vec3 turbulence(vec3 p, float power) {
  vec3 t = vec3(-.5);

  for (float f = 1.0 ; f <= 2.0 ; f++ ){
    t += abs(noise3(vec4(vec3(p * power), 1.0)));
  }

  return t;
}