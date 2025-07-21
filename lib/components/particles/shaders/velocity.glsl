

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 vel = texture2D(textureVelocity, uv);

  gl_FragColor = vel;
}