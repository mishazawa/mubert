precision highp float;

varying vec3 vPatternD;
// varying vec3 vWorldPosition;

// vec3 stoc(vec2 uv) {
//   vec3 p;
//   float phi = (uv.x - 0.5) * PI * 2.0;
//   float the = uv.y * PI;
//   p.x = sin(the)*cos(phi);
//   p.y = cos(the);
//   p.z = sin(the)*sin(phi);
//   return p;
// }

void main() {

  vec3 pp = vec3(position);
  // pp = stoc(uv);
  vec3 nn = normalize(pp);
  

  float animation = uTime * SPEED;
  DisplacePatternInput data_in = DisplacePatternInput(pp, nn, uv);
  DisplacePatternOutput data_out = displace_pattern(data_in, animation);
  vec3 new_normal = normalize(data_out.normal);
  vec3 new_position = data_out.position;


  vPosition = pp;
  vNormal = nn;
  vUv = uv;
  vPositionD = new_position;
  vNormalD = normalMatrix * new_normal;

  csm_Normal = new_normal;
  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);


  v_nmat = normalMatrix;

  vec4 worldPosition2 = modelMatrix * vec4(new_position, 1.0);
  vWorldPosition = worldPosition2.xyz;

}

// void main() {
//   csm_Position = position;
//   csm_Normal = normal;

//   vPosition = position;
//   // vNormal = normalize(position);
//   vNormal = normal;
//   vUv = uv;
  
//   float animation = uTime * SPEED;
//   DisplacePatternInput data_in = DisplacePatternInput(vPosition, vNormal, vUv);
//   DisplacePatternOutput data_out = displace_pattern(data_in, animation);

//   vNormalD = data_out.normal;
//   vPositionD = data_out.position;
//   vPositionD = data_out.position;
//   vPatternD = data_out.pattern;

//   v_mmat = projectionMatrix * modelViewMatrix;

//   mat3 M3 = mat3(modelMatrix);
//   mat3 O3 = mat3(uObjectMatrix);

//   // vec3 worldPos = (modelMatrix * uObjectMatrix * vec4(vPositionD, 1.0)).xyz;
//   // vec3 worldNrm = normalize(M3 * O3 * vNormalD);

//   // vec3 worldPos = (modelMatrix * vec4(vPositionD, 1.0)).xyz;
//   // vec3 worldNrm = normalize(normalMatrix * vNormalD);

//   // vWorldPosition = worldPos;
//   // vWorldNormal   = worldNrm;

//   vWorldPosition = position;
//   vWorldNormal   = normal;

//   // csm_Position = worldPos;
//   // csm_Normal = vNormalD;

//   csm_Position = position;
//   csm_Normal = normal;
//   // return;
// }