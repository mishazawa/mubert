void main() {
  float animation = uTime * SPEED;

  DisplacePatternInput data_in = DisplacePatternInput(
    vPositionD,
    vNormalD,
    vUv,
    animation
  );

  DisplacePatternOutput data_out = displace_pattern(data_in);
  CoatOutput coat              = coat_pattern(data_out);


  //#inlude<solid_parameters>
  csm_DiffuseColor.rgba = vec4(coat.color, 1.0);
}
