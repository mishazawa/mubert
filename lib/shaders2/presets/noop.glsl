DisplacePatternOutput displace_pattern(in DisplacePatternInput data) {
  return DisplacePatternOutput(data.position, data.normal, vec3(0.));
}

CoatOutput coat_pattern(in DisplacePatternOutput data) {
  return CoatOutput(uColor1, data.normal, 1., uRoughness);
}
