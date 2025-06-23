void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;

  float animation = uTime * SPEED;

  DisplacePatternInput data_in = DisplacePatternInput(
    vPosition,
    vNormal,
    vUv,
    animation
  );

  DisplacePatternOutput data_out = displace_pattern(data_in);

  vNormalD   = data_out.normal;
  vPositionD = data_out.position;

  csm_Position = vPositionD;
  csm_Normal = vNormalD;
}