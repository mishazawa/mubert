varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>
//#include<calc_bump>

void main() {
  vec3 key = vec3(uColorKeyValue);

  //#include<common_standard_props>

  csm_DiffuseColor.rgba = vec4(key, 1.0);
}