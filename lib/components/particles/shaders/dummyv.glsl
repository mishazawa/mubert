uniform sampler2D texturePositions;
void main() {
  vec4 pos = texture2D(texturePositions, uv);
  csm_Position = pos.xyz;
}