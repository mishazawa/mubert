out mat4 v_mmat;
void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;
  float animation = uTime * SPEED;

  DisplacePatternInput data_in = DisplacePatternInput(vPosition, vNormal, vUv);

  DisplacePatternOutput data_out = displace_pattern(data_in, animation);

  vNormalD = data_out.normal;
  vPositionD = data_out.position;
  v_mmat = modelMatrix;

  // object space coordinates
  vec3 objectPosition = (modelMatrix * vec4(vPositionD, 1.0)).xyz;
  // view direction in object space
  vWorldPosition = normalize(cameraPosition - objectPosition);
  // normalized object space normals
  vWorldNormal = normalize((modelMatrix * vec4(vNormalD, 0.0)).xyz);

  csm_Position = vPositionD;

  csm_Normal = vNormalD;
}