varying vec3 vPatternD;




void main() {

  vPosition = position;
  vNormal = normal;
  vUv = uv;
  float animation = uTime * SPEED;

  DisplacePatternInput data_in = DisplacePatternInput(vPosition, vNormal, vUv);
  DisplacePatternOutput data_out = displace_pattern(data_in, animation);

  // DisplacePatternInput data_in1;
  // DisplacePatternInput data_in2;
  // DisplacePatternInput data_in3;
  // DisplacePatternInput data_in4;
  // float eps2 = 1.0/32.0/4.0*1.0;
  // vec2 pos2 = ctos(vPosition);
  // vec2 pos2_1 = pos2 + vec2(eps2, 0.0);
  // vec2 pos2_2 = pos2 + vec2(0.0, eps2*2.0);
  // vec2 pos2_3 = pos2 + vec2(-eps2, 0.0);
  // vec2 pos2_4 = pos2 + vec2(0.0, -eps2*2.0);
  // vec3 pos3_1 = stoc(pos2_1);
  // vec3 pos3_2 = stoc(pos2_2);
  // vec3 pos3_3 = stoc(pos2_3);
  // vec3 pos3_4 = stoc(pos2_4);

  // data_in1.position = pos3_1;
  // data_in2.position = pos3_2;
  // data_in3.position = pos3_3;
  // data_in4.position = pos3_4;

  // data_in1.normal = normalize(data_in1.position);
  // data_in2.normal = normalize(data_in2.position);
  // data_in3.normal = normalize(data_in3.position);
  // data_in4.normal = normalize(data_in4.position);

  // DisplacePatternOutput data_out1 = displace_pattern(data_in1, animation);
  // DisplacePatternOutput data_out2 = displace_pattern(data_in2, animation);
  // DisplacePatternOutput data_out3 = displace_pattern(data_in3, animation);
  // DisplacePatternOutput data_out4 = displace_pattern(data_in4, animation);

  // data_out.position = mix((
  //   data_out1.position +
  //   data_out2.position +
  //   data_out3.position +
  //   data_out4.position
  //   ) / 4.0, data_out.position, 0.5);


  vNormalD = data_out.normal;
  vPositionD = data_out.position;
  vPatternD = data_out.pattern;
  v_mmat = projectionMatrix * modelViewMatrix;

  // // object space coordinates
  vec3 objectPosition =
      (uObjectMatrix * modelMatrix * vec4(vPositionD, 1.0)).xyz;
  // // view direction in object space
  // vWorldPosition = normalize(cameraPosition - objectPosition);
  // // normalized object space normals
  // vWorldNormal =
  //     normalize((uObjectMatrix * modelMatrix * vec4(vNormalD, 0.0)).xyz);


  mat3 M3 = mat3(modelMatrix);
  mat3 O3 = mat3(uObjectMatrix);
  vec3 worldPos = (modelMatrix * uObjectMatrix * vec4(vPositionD, 1.0)).xyz;
  vec3 worldNrm = normalize(M3 * O3 * vNormalD);
  vWorldPosition = worldPos;
  vWorldNormal   = worldNrm;



  csm_Position = worldPos;
  csm_Normal = vNormalD;
}