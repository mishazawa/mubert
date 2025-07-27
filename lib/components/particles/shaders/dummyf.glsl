// particles fragment

in vec4 v_color;

void main() {


  vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
  vec2 cUV = 2. * uv - 1.;
  float a = .15 / length(cUV);
  if (a < 0.15)
    discard;
  csm_FragColor = vec4(v_color);
}