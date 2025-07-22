uniform sampler2D uRefTex;

// just to draw particles
void main() {
  vec4 pos = texture2D(uRefTex, uv)*2.0-1.0;
  csm_Position = pos.xyz;
}