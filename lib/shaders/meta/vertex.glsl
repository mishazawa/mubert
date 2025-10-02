precision highp float;

varying vec3 vPatternD;

void main() {

  vPosition = position;
  vNormal = normal;
  vUv = uv;
  
  float animation = uTime * SPEED;
  DisplacePatternInput data_in = DisplacePatternInput(vPosition, vNormal, vUv);
  DisplacePatternOutput data_out = displace_pattern(data_in, animation);

  vNormalD = data_out.normal;
  vPositionD = data_out.position;
  vPatternD = data_out.pattern;

  v_mmat = projectionMatrix * modelViewMatrix;

  mat3 M3 = mat3(modelMatrix);
  mat3 O3 = mat3(uObjectMatrix);

  // vec3 worldPos = (modelMatrix * uObjectMatrix * vec4(vPositionD, 1.0)).xyz;
  // vec3 worldNrm = normalize(M3 * O3 * vNormalD);

  vec3 worldPos = (modelMatrix * vec4(vPositionD, 1.0)).xyz;
  vec3 worldNrm = normalize(normalMatrix * vNormalD);

  vWorldPosition = worldPos;
  vWorldNormal   = worldNrm;

  csm_Position = worldPos;
  csm_Normal = vNormalD;
}