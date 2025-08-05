// particles fragment
in vec4 v_color;
uniform vec3 uColor1a;
uniform vec3 uColor2a;
uniform float uTime;
uniform float uRMS;
uniform vec3 uRotationAxis;

vec4 DEBUG = vec4(1., 0., 0., 1.);

void main() {

  vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
  vec2 cUV = 2. * uv - 1.;
  float a = .15 / length(cUV);
  if (a < 0.15)
    discard;

  float pt = v_color.r;
  vec3 nc = mix(uColor1a, uColor2a, pt);
  float na = 1.0 - pow((pt * 2.0 - 1.0), 2.0);
  na = smoothstep(0.0, 1.0, na) * 0.5;

  vec4 new_color = vec4(nc, na);
  new_color.a *= length(new_color.rgb);
  new_color.rgb = pow(new_color.rgb, vec3(1.0 / 2.2)); // gamma correction
  csm_FragColor = vec4(new_color);
}