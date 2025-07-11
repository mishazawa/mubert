void main() {
  float animation = uTime * SPEED;

  DisplacePatternInput data_in = DisplacePatternInput(
      // just for formatting sake
      vPosition,
      //#include<vNormal>
      vUv);

  DisplacePatternOutput data_out = displace_pattern(data_in, animation);
  CoatOutput coat = coat_pattern(data_out, animation);

  //#include<solid_parameters>

#ifdef IS_POINT
  // draw round circle
  vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
  vec2 cUV = 2. * uv - 1.;
  float a = .15 / length(cUV);
  if (a < 0.15)
    discard;
#else
#endif
  csm_DiffuseColor.rgba = vec4(coat.color, 1.0);
}
