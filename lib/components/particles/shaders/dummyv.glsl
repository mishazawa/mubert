uniform sampler2D uPositionsTex;

// just to draw particles
void main() {
  vec4 pos = texture2D(uPositionsTex, uv) * 2.0 - 1.0;
  csm_Position = pos.xyz;
}