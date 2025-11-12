
// in vec3 v_wpos;
in vec3 vPatternD;
void main() {


  vec3 pp = vec3(vPosition);
  // pp = stoc(vUv);
  vec3 nn = normalize(pp);

  float animation = uTime * SPEED;
  // DisplacePatternInput data_in = DisplacePatternInput(
  //     vPosition,
  //     vNormal,
  //     vUv);
  DisplacePatternInput data_in = DisplacePatternInput(
      pp,
      nn,
      vUv);
  DisplacePatternOutput data_out = displace_pattern(data_in, animation);
  // data_out.position = vPositionD;
  CoatOutput coat = coat_pattern(data_out, animation);

  //#include<solid_parameters>



  csm_DiffuseColor.rgba = coat.color;
  // csm_DiffuseColor.rgba = vec4(0.5, 0.5, 0.5, 1.0);
  // csm_DiffuseColor.rgba = vec4(vUv.x, vUv.y, 0.0, 0.0);
  // vec3 new_normal = normalize(data_out.normal);
  // new_normal = normalMatrix * new_normal;
  // csm_FragNormal = vNormalD;
  // csm_Transmission = coat.color.a;


// #ifdef FLAT
//   pos1 = vec3(gl_FragCoord.x, gl_FragCoord.y, 0.0) / 300.0 - 1.5;
// #endif

// #if IS_POINT
//   // draw round circle
//   vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
//   vec2 cUV = 2. * uv - 1.;
//   float a = .15 / length(cUV);
//   if (a < 0.15)
//     discard;
// #else
// #endif



}
