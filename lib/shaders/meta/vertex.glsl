void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;
  vCameraPositionW = cameraPosition;

  float animation = uTime * SPEED;

  DisplacePatternInput data_in = DisplacePatternInput(
    vPosition,
    vNormal,
    vUv
  );

  DisplacePatternOutput data_out = displace_pattern(data_in, animation);

  vNormalD   = data_out.normal;
  vPositionD = data_out.position;

  csm_Position = vPositionD;
  csm_Normal = vNormalD;
}