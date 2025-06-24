#ifdef VERTEX
#else
#endif

DisplacePatternOutput displace_pattern(in DisplacePatternInput data, float animation) {
  return DisplacePatternOutput(data.position, data.normal, vec3(0.));
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  return CoatOutput(uColor1, data.normal, 1., uRoughness);
}
