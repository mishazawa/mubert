// fragment shader
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float animation = uTime * SPEED;
  vec4 prev_frame = texture2D(uTextureSimulation1, uv);
  vec4 prev_pos = texture2D(texturePosition, uv);
  float pos_scale = 0.1;

  DisplacePatternInput data_in =
      DisplacePatternInput(prev_pos.xyz*pos_scale, vec3(1.), uv);
  DisplacePatternOutput data_out = displace_pattern(data_in, animation);



  gl_FragColor = vec4(data_out.pattern*1.0, 1.0);
}