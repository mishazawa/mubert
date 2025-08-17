uniform sampler2D uPositionsTex;
uniform vec3 uColor1a;
uniform vec3 uColor2a;
uniform float uTime;
uniform float uRMS;
uniform mat4 uObjectMatrix;

out vec4 v_color;
out vec3 v_pos;
// out vec3 vWorldPosition; 

// just to draw particles
void main() {
  float vid = float(gl_VertexID);

  vec2 vres = vec2(128.0, 128.0);
  float vy = floor(vid / vres.x);
  float vx = mod(vid, vres.x);
  float vy2 = mod(vy, 8.0) / 7.0;
  vec2 vuv = vec2(vx + 0.0, vy + 0.0) / vres;

  v_color = vec4(vuv.y);

  vec4 pos = texture2D(uPositionsTex, vuv) * 2.0 - 1.0;


  mat3 M3 = mat3(modelMatrix);
  mat3 O3 = mat3(uObjectMatrix);
  vec3 worldPos = (modelMatrix * uObjectMatrix * vec4(pos.xyz, 1.0)).xyz;
  // vec3 worldNrm = normalize(M3 * O3 * vNormalD);
  // vWorldPosition = worldPos;
  // vWorldNormal   = worldNrm;

  // gl_PointSize = 20.0;

  // pos.xyz = (modelMatrix * uObjectMatrix * vec4(pos.xyz, 1.0)).xyz;
  csm_Position = worldPos;
  v_pos = worldPos;
  // csm_Position = vec3(0.0);
}