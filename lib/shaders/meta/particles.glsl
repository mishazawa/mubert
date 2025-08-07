//#include<random>
//#include<noise3>

vec3 gravity(in vec3 position, float falloff, float strength) {
    return -position * pow(length(position * falloff), 2.0) * strength;
}

void main() {

  // Copy from previous frame

  int NTRAILS = int(pow(2.0, random(uSeed + 0.123) * 6.0));
  int T_ID = int(gl_FragCoord.y) % NTRAILS;
  if (T_ID > 0) {
    vec2 uv2 =
        (gl_FragCoord.xy + vec2(0.0) + vec2(0.0, -1.0)) / uSimulationRes.xy;
    vec2 uv3 =
        (gl_FragCoord.xy + vec2(0.0) + vec2(0.0, 0.0)) / uSimulationRes.xy;
    gl_FragColor = texture2D(texturePosition, uv2) * 1.0;
    // gl_FragColor = vec4(0.1, 0.0, 0.0, 1.0);
    return;
  }

  // LOAD
  vec2 simRes = uSimulationRes.xy;
  vec2 uv = (gl_FragCoord.xy + vec2(0.0)) / simRes.xy;
  int id = int(gl_FragCoord.x + gl_FragCoord.y * simRes.x);
  vec4 ppos = texture2D(texturePosition, uv);
  vec4 vel = texture2D(uTextureSimulation1, uv);
  float mass = mix(0.5, 1.0, random(float(id)*0.1212332));
  ppos.xyz = ppos.xyz * 2.0 - 1.0;
  vel.xyz = vel.xyz * 2.0 - 1.0;


  // UPDATE


  vec4 npos = ppos;
  float strength = 0.01;
  // strength *= mix(0.1, 2.0, uRMS);
  npos.xyz += vel.xyz * strength * mass;


  // RESET PARTICLE
  float rtime = random(float(id) + uTime * 1.424534224)*random(float(id) + uTime * 0.322224);
  float reset_rate = 0.0001;
  bool reset = (rtime < reset_rate);
  if (reset) {
    vec3 newpos =
        vec3(random(float(id) + 1.23 + uTime * 1.124534224),
             random(float(id) + 3.33 + uTime * 1.424534424),
             random(float(id) + 4.53 + uTime * 1.422534224));
    npos = vec4(normalize(newpos * 2.0 - 1.0), 1.0) * 0.5;
    // npos.xyz = vec3(uv.x, uv.y, 1.0);
  }

  npos.xyz = npos.xyz * 0.5 + 0.5;
  gl_FragColor = vec4(npos.xyz, 1.0);
}