varying float vDisplacement;


//#include<calc_bump>

void main() {

  vec3 newColor = vec3(1.);


  vec3 N = vNormal;
  csm_Bump = perturbNormalArb(
    -vViewPosition,
    N,
    vec2(dFdx(vDisplacement), dFdy(vDisplacement)), 
    smoothstep(0., 1., dot(N, normalize(vViewPosition))));

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}