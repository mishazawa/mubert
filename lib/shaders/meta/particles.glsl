//#include<random>
//#include<noise3>

vec4 gravity(in vec4 position) { return -position * length(position) * .1; }

void main() {
  if (gl_FragCoord.y >= 1.0) {
    vec2 uv2 =
        (gl_FragCoord.xy + vec2(0.0) + vec2(0.0, -1.0)) / uSimulationRes.xy;
    vec2 uv3 =
        (gl_FragCoord.xy + vec2(0.0) + vec2(0.0, 0.0)) / uSimulationRes.xy;
    gl_FragColor = texture2D(texturePosition, uv2) * 1.0;
    // gl_FragColor = vec4(0.1, 0.0, 0.0, 1.0);
    return;
  }
  vec2 uv = (gl_FragCoord.xy + vec2(0.5)) / uSimulationRes.xy;
  vec4 vel = texture2D(uTextureSimulation1, uv);
  vec4 prev_frame = texture2D(texturePosition, uv);
  prev_frame.xyz = prev_frame.xyz * 2.0 - 1.0;
  vel.xyz = vel.xyz * 2.0 - 1.0;

  vec4 next_frame = prev_frame + vel * .01 * (1.0 + uRMS);
  next_frame += gravity(next_frame) * .01 * (1.0-uRMS);

  next_frame = mix(next_frame, normalize(next_frame)*1.5, 0.2);

  float rtime = random(uv.x * 1.3 + uv.y * 0.7819399 + uTime * 1.4245342224);
  float rtime2 =
      random(uv.x * 0.843 + uv.y * 0.3811999 + uTime * 1.4252342224 + 0.5);

  if (rtime * rtime2 > 0.95) {
    vec3 newpos =
        vec3(random(1.0 + uv.x + uv.y * 0.381999 + uTime * 1.425342224),
             random(2.0 + uv.x + uv.y * 0.381999 + uTime * 1.425342224),
             random(3.0 + uv.x + uv.y * 0.381999 + uTime * 1.425342224));
    next_frame = vec4(normalize(newpos * 2.0 - 1.0), 1.0) * 1.5;
  }

  gl_FragColor = vec4(next_frame.xyz * 0.5 + 0.5, 1.0);
}