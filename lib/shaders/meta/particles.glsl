//#include<random>
//#include<noise3>


uniform float uTime;

float random(float x) {
  return fract(sin(x) * 43758.5453);
}

vec4 gravity(in vec4 position) { return -position * length(position) * .1; }

void main() {
  vec2 uv = (gl_FragCoord.xy+vec2(0.5)) / resolution.xy;
  vec4 vel = texture2D(uTextureSimulation1, uv);
  vec4 prev_frame = texture2D(texturePosition, uv);
  prev_frame.xyz = prev_frame.xyz*2.0-1.0;
  vel.xyz = vel.xyz * 2.0 - 1.0;

  vec4 next_frame = prev_frame + vel * .2;
  next_frame += gravity(next_frame) * .01;

  float rtime = random(uv.x+uv.y*0.381999+uTime*1.425342224);

  if (rtime < 0.0001) {
    vec3 newpos = vec3(
      random(1.0+uv.x+uv.y*0.381999+uTime*1.425342224),
      random(2.0+uv.x+uv.y*0.381999+uTime*1.425342224),
      random(3.0+uv.x+uv.y*0.381999+uTime*1.425342224)
    );
    next_frame = vec4(normalize(newpos*2.0-1.0), 1.0)*0.5;
  }

  gl_FragColor = vec4(next_frame.xyz*0.5+0.5, 1.0);
}