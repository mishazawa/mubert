uniform sampler2D uRefTex;

// just to draw particles
void main() {
  vec4 pos = texture2D(uRefTex, uv);
  csm_Position = pos.xyz;
}