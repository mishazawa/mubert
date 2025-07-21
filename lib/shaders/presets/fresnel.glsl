#define SPEED 1.

#ifdef VERTEX
#else
#endif

float lambertLighting(vec3 normal, vec3 viewDirection) {
  return max(dot(normal, viewDirection), 0.0);
}

float fresnelFunc(float amount, float offset, vec3 normal, vec3 view) {
  return offset + (1.0 - offset) * pow(1.0 - dot(normal, view), amount);
}
DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
                                       float animation) {
  return DisplacePatternOutput(data.position, data.normal, vec3(0.));
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  float fresnel = fresnelFunc(1., 0., vWorldNormal, vWorldPosition);
  float diffuse = lambertLighting(vWorldNormal, vWorldPosition);

  vec3 finalColor = mix(uColor1 * diffuse, uColor2, fresnel);
  return CoatOutput(finalColor, data.normal, 1., uRoughness, uEmission,
                    uIridescence, 0.);
}
