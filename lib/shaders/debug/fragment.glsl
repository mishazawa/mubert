varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>
//#include<calc_bump>

void main() {
  vec3 key = vec3(uColorKeyValue);

  vec3 N = vNormal * 2.5;
  csm_Bump = perturbNormalArb(
    -vViewPosition,
    N,
    vec2(dFdx(vDisplacement), dFdy(vDisplacement)), 
    smoothstep(0., 1., dot(N, normalize(vViewPosition))));

  //#include<common_standard_props>

  csm_DiffuseColor.rgba = vec4(key, 1.0);
}