vec4 gravity(in vec4 position) { return -position * length(position) * .1; }

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 vel = texture2D(uTextureSimulation1, uv);
  vec4 prev_frame = texture2D(texturePosition, uv);

  vec4 next_frame = prev_frame + vel * .01;
  next_frame += gravity(next_frame) * .01;

  gl_FragColor = vec4(next_frame.xyz, 1.0);
}