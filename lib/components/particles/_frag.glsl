// particles fragment
in vec4 v_color;
in vec3 v_pos;
in vec2 v_texuv;
uniform vec3 uColor1a;
uniform vec3 uColor2a;
uniform vec3 uColor3a;
uniform vec3 uColor4a;
uniform vec3 uColor5a;
uniform float uTime;
uniform float uRMS;
uniform float uPsize2;

vec4 DEBUG = vec4(1., 0., 0., 1.);

void main() {

  vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
  vec2 cUV = 2. * uv - 1.;
  float a = smoothstep(1.0, 0.0, length(cUV));

  float parb = 1.0-pow(v_texuv.y*2.0-1.0, 2.0);
  a *= parb;

  if (uv.x > uPsize2)
    discard;
  if (uPsize2 < 0.5)
    discard;

  if (a < 0.15)
    discard;




  
  vec3 c_inner = mix(uColor1a, uColor2a, sin(v_texuv.x*3.0+uTime*10.0+v_pos.x)*0.5+0.5);
  vec3 c_inner2 = mix(uColor3a, uColor4a, sin(v_texuv.x*1.322+uTime*4.0+v_pos.y)*0.5+0.5);
  c_inner = mix(c_inner, c_inner2, sin(v_texuv.x*1.0+uTime*10.0+v_pos.z)*0.5+0.5);

  vec3 c_outer = c_inner;
  // c_inner = pow(c_inner, vec3(0.5));

  float npos = uv.x*10.0;
  float nval = sin(v_texuv.x*5.322+uTime*1.0)*0.5+0.5;

  vec3 col1 = mix(c_inner, c_outer, a*nval);

  vec4 new_color = vec4(col1, a)*2.0;


  new_color = clamp(new_color, 0., 1.);
  new_color.a *= (new_color.r + new_color.g + new_color.b) / 3.0;
  csm_FragColor = vec4(new_color);
}