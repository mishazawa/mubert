// std material props
csm_Roughness = uRoughness;
csm_Clearcoat = uClearcoat;
csm_ClearcoatRoughness = uClearcoatRoughness;
csm_Iridescence = uIridescence;


vec3 N = vNormal * 5.;
csm_Bump = perturbNormalArb(
  -vViewPosition,
  N,
  //vec2(dFdx(vDisplacement + (.1* line)), dFdy(vDisplacement+(.1* line))), 
  vec2(dFdx(vDisplacement), dFdy(vDisplacement)), 
  smoothstep(0., 1., dot(N, normalize(vViewPosition))));