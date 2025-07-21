
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 vel = texture2D(textureVelocity, uv);
  vec4 pos = texture2D(texturePosition, uv);
  vec3 position = pos + vel;

  gl_FragColor = vec4(position.xyz, pos.w);
}