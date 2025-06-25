void main() {
  float animation = uTime * SPEED;

  DisplacePatternInput data_in = DisplacePatternInput(
    vPosition,
    //#inlude<vNormal>
    vUv
  );

  DisplacePatternOutput data_out = displace_pattern(data_in, animation);
  CoatOutput coat              = coat_pattern(data_out, animation);


  //#inlude<solid_parameters>
  csm_DiffuseColor.rgba = vec4(coat.color, 1.0);
}
