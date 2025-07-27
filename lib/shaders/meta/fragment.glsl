void main() {
  float animation = uTime * SPEED;

  vec3 pos1 = vPosition;
#ifdef FLAT
  pos1 = vec3(gl_FragCoord.x, gl_FragCoord.y, 0.0) / 300.0 - 1.5;
#endif

  DisplacePatternInput data_in = DisplacePatternInput(
      // just for formatting sake
      pos1,
      //#include<vNormal>
      vUv);

  DisplacePatternOutput data_out = displace_pattern(data_in, animation);
  CoatOutput coat = coat_pattern(data_out, animation);

  //#include<solid_parameters>

#if IS_POINT
  // draw round circle
  vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
  vec2 cUV = 2. * uv - 1.;
  float a = .15 / length(cUV);
  if (a < 0.15)
    discard;
#else
#endif
  csm_DiffuseColor.rgba = coat.color;
}
