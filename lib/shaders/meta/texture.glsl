// fragment shader


void main() {

  // COPY
  // if (gl_FragCoord.x > 0.0) {
  //   vec2 uv = (gl_FragCoord.xy + vec2(0.5) + vec2(0.0, -1.0)) / resolution.xy;
  //   gl_FragColor = texture2D(uTextureSimulation1, uv);
  //   return;
  // }

  // LOAD
  vec2 uv = (gl_FragCoord.xy + vec2(0.0)) / resolution.xy;
  float animation = uTime * SPEED;
  vec4 pvel = texture2D(uTextureSimulation1, uv);
  vec4 ppos = texture2D(texturePosition, uv);
  pvel.xyz = pvel.xyz * 2.0 - 1.0;
  ppos.xyz = ppos.xyz * 2.0 - 1.0;


  vec3 n_pos = normalize(ppos.xyz);
  // vec3 n_pos = ppos.xyz;
  DisplacePatternInput data_in =
      DisplacePatternInput(n_pos, n_pos, uv);
  DisplacePatternOutput data_out = displace_pattern(data_in, animation);


  vec3 vector = vec3(0.0);
  vec3 vnoise = noise3(ppos.xyz * 0.25, animation);
  vnoise += noise3(ppos.xyz * 1.0, 100.0+animation)*0.0;
  vector += vnoise * 0.1;


  // float npatt = snoise(data_out.pattern*(0.05+pow(random(uSeed+0.921), 2.0))*0.2);
  // vec3 offset = data_out.normal*(npatt) + ns*(npatt*0.5+0.5) * pow(random(uSeed+0.99331), 2.0);
  // vec3 new_pos = data_out.position + offset;
  // vec3 new_pos = data_out.position;

  vec3 target = data_out.position*1.5;
  // vec3 target = normalize(ppos.xyz);

  vec3 tforce = target - ppos.xyz;
  float tforce_length = length(tforce);
  tforce = normalize(tforce) * pow(tforce_length, 2.0) * 1.0;
  vector += tforce;


  vector = pvel.xyz * 0.5 + vector * mix(0.1, 1.0, uRMS) * 2.0;

  vector = clamp(vector, -1.0, 1.0);



  // vector = vec3(0.0);

  // vector *= uRMS;
  // vector = vec3(prev_frame_pos.xyz*0.5);
  // vector = data_out.position-prev_frame_pos.xyz;
  // vector = normalize(vector);

  // vector = prev_frame.xyz * 0.25 + vector * 0.1;

  // vector = vec3(0.0);
  
  gl_FragColor = vec4(vector * 0.5 + 0.5, 1.0);
}