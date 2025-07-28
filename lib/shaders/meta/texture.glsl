// fragment shader
void main() {

  // if (gl_FragCoord.x > 0.0) {
  //   vec2 uv = (gl_FragCoord.xy + vec2(0.5) + vec2(0.0, -1.0)) / resolution.xy;
  //   gl_FragColor = texture2D(uTextureSimulation1, uv);
  //   return;
  // }

  vec2 uv = (gl_FragCoord.xy + vec2(0.5)) / resolution.xy;
  float animation = uTime * SPEED;
  vec4 prev_frame = texture2D(uTextureSimulation1, uv);
  vec4 prev_frame_pos = texture2D(texturePosition, uv);
  prev_frame.xyz = prev_frame.xyz * 2.0 - 1.0;
  prev_frame_pos.xyz = prev_frame_pos.xyz * 2.0 - 1.0;

  DisplacePatternInput data_in =
      DisplacePatternInput(prev_frame_pos.xyz, vec3(-1.), uv);
  DisplacePatternOutput data_out = displace_pattern(data_in, animation);


  vec3 vector = noise3(prev_frame_pos.xyz * 0.5 + data_out.pattern, animation);

  // vector *= uRMS;
  // vector = vec3(prev_frame_pos.xyz*0.5);
  // vector = data_out.position-prev_frame_pos.xyz;
  // vector = normalize(vector);

  // vector = prev_frame.xyz * 0.25 + vector * 0.1;

  gl_FragColor = vec4(vector * 0.5 + 0.5, 1.0);
}