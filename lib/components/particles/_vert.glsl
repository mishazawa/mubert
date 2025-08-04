uniform sampler2D uPositionsTex;
uniform vec3 uColor1a;
uniform vec3 uColor2a;

out vec4 v_color;

// just to draw particles
void main() {
  float vid = float(gl_VertexID);

  vec2 vres = vec2(128.0, 128.0);
  float vy = floor(vid / vres.x);
  float vx = mod(vid, vres.x);
  vec2 vuv = vec2(vx + 0.5, vy + 0.5) / vres;

  v_color = vec4(vuv.y);

  vec4 pos = texture2D(uPositionsTex, vuv) * 2.0 - 1.0;
  pos.xyz = (modelMatrix * vec4(pos.xyz, 1.0)).xyz;
  csm_Position = pos.xyz;
  // csm_Position = vec3(0.0);
}