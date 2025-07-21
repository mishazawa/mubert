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

  csm_Position = vPositionD;
  csm_Normal = vNormalD;
}