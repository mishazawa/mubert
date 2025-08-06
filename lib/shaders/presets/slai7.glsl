#define DIST_AMP 5.
#define NOISE_DIST_AMP 1.
#define SPEED .1
#define FREQ 1.
#define FRAC_SCALE 16
#define DISPLACE_SCALE 2.0
#define DISPLACE_POS_SCALE 0.5


//#include<math>
//#include<noise3>
//#include<voronoi3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>





vec3 pattern(in vec3 P, in float animation) {

  ////// Pre-distort
  vec3 pos = P;
  // pos = normalize(pos);
  //////


  ////// Parameters
  float tscale = pow(random(uSeed*0.855 + 19.0), 4.0);
  float symmetry_n = floor(mix(1.0, 6.0, random(uSeed + 7.1282)));
  float vor_scale = pow(random(uSeed*0.821 + 74.0), 4.0) * 1.0;
  float simpx_scale = pow(random(uSeed*0.923 + 31.0), 4.0) * 1.0;
  float twist_amp = pow(random(uSeed*0.831 + 31.0), 6.0) * 2.0;
  float global_scale = mix(0.5, 2.0, random(uSeed + 3.115));
  float sinnoise_amp = pow(random(uSeed*0.943 + 68.0), 4.0) * 1.0;
  float sinnoise_freq = pow(random(uSeed*0.933 + 64.0), 6.0) * 1.0;

  // Npos pars
  float simpx_amp =     pow(random(uSeed*0.855 + 19.0), 3.0);
  float vor_amp =       pow(random(uSeed*0.841 + 43.0), 1.0);
  float symmetry_amp =  pow(random(uSeed*0.821 + 39.0), 3.0);
  float py_val =        pow(random(uSeed*0.831 + 31.0), 1.0);
  float pos_val =       pow(random(uSeed*0.943 + 64.0), 4.0);

  float npow = 3.0;
  simpx_amp = pow(simpx_amp, npow);
  vor_amp = pow(vor_amp, npow);
  symmetry_amp = pow(symmetry_amp, npow);
  py_val = pow(py_val, npow);
  pos_val = pow(pos_val, npow);

  float nsum = 0.0;
  nsum += simpx_amp;
  nsum += vor_amp;
  nsum += symmetry_amp;
  nsum += py_val;
  nsum += pos_val;

  simpx_amp /= nsum;
  vor_amp /= nsum;
  symmetry_amp /= nsum;
  py_val /= nsum;
  pos_val /= nsum;






  /////// Compute
  pos = sinnoise_distort(pos, sinnoise_amp, sinnoise_freq, vec3(animation*0.0, 0.0, uSeed));

  float r_ax = pos.y;
  pos.xz = pos.xz * mat2(
    cos(r_ax * twist_amp), -sin(r_ax * twist_amp),
    sin(r_ax * twist_amp), cos(r_ax * twist_amp)
  );

  float angle = atan(pos.z, pos.x);
  float symmetry = sin(angle * symmetry_n) * smoothstep(1.0, 0.0, pow(abs(pos.y), 2.0));

  float simpx = snoise(pos*simpx_scale+vec3(0.0, animation * 10.0, uSeed * 10.0)) * 0.5 + 0.5;
  vec3 vor = voronoi3d(pos*vor_scale+vec3(0.0, uSeed + animation * 10.0, 0.0));
  float vor_idr = random(uSeed + vor.z*10.0);
  float vor_dist = smoothstep(0.0, 1.0, vor.x);


  vec3 npos = vec3(
    pos.y * py_val*2.0,
    symmetry * symmetry_amp,
    vor_dist * vor_amp + simpx * simpx_amp
  );
  npos += pos * pos_val;

  npos *= global_scale;

  vec2 auv = vec2(
    snoise(npos+vec3(0.0, 0.0, random(uSeed + 6.0) * 100.0)),
    snoise(npos+vec3(0.0, 0.0, random(uSeed + 6.0) * 100.0))
    ) * 0.5 + 0.5;
  float sub_scale = 2.0;
  vec2 auv2 = vec2(
    snoise(npos*sub_scale+vec3(0.0, 0.0, random(uSeed + 7.0) * 100.0)),
    snoise(npos*sub_scale+vec3(0.0, 0.0, random(uSeed + 77.0) * 100.0))
    );
  auv = auv*0.8+ auv2*0.2;

  // vec2 auv = vec2(0.5, pos.y);
  auv = clamp(auv, 0.0, 1.0);

  // auv.x = 0.5;
  auv.y *= tscale;
  // auv.y = 1.0-auv.y; // flip y

  ////////// Apply UV
  float audio = texture(uAudioTex, auv).r;
  float ablur = blur13(uAudioTex, auv, vec2(128.0, 128.0), vec2(1.0, 1.0)).r;
  audio = mix(audio, ablur, float(VERTEX)>0.0); // blur only in fragment shader
  ///////////

  audio = smoothstep(0.0, 1.0, pow(audio, 1.0));
  
  vec3 patt = vec3(auv, audio);



  return patt;

}


vec3 displace(in vec3 P, in vec3 N, in vec3 patt, in float animation) {

  vec3 npos = P*pow(random(uSeed+5.41), 2.0);
  npos = sinnoise_distort(npos, 0.5, 0.25, vec3(animation, 0.0, uSeed));

  vec3 ns = vec3(
    snoise(npos + vec3(0.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
    snoise(npos + vec3(10.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
    snoise(npos + vec3(20.5, 2.0, fract(uSeed / 1000.0) * 100.0))
    );
  float npatt = snoise(patt*(0.05+pow(random(uSeed+0.921), 2.0))*0.2);
  vec3 offset = N*(npatt) + ns*(npatt*0.5+0.5) * pow(random(uSeed+0.99331), 2.0);

  vec3 new_pos = P + offset;

  return new_pos;
}


//#include<calc_normal>
DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
                                       float animation) {
  Neighbours samples = getNeighbours(data.position, data.normal);
  vec3 patt = pattern(data.position, animation);
  vec3 p = displace(data.position, data.normal, patt, animation);
  vec3 n = calcNormalFromSamples(
      p, displace(samples.a, data.normal, patt, animation),
      displace(samples.b, data.normal, patt, animation));
  return DisplacePatternOutput(p, n, patt);
}


CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {


  // // // // // SETUP
  #if VERTEX
  #define fragpos vec2(0.0)
  #else
  #define fragpos gl_FragCoord.xy
  #endif

  vec3 opos = (viewMatrix * vec4(data.position, 1.0)).xyz;
  vec3 viewDir = normalize(vec3(0.0) - opos);
  // float fresnel = pow(1.0 - max(dot(normalize(data.normal), normalize(viewDir)), 0.0), 2.0);
  // vec3 reflected = reflect(viewDir, normalize(data.normal));
  // // // // //


  // // // // // REFRACTION
  float eta = 1.0 / 1.5; // refraction index
  vec3 refracted = refract(viewDir, normalize(data.normal), eta);

  vec2 screen_uv = fragpos / uParticlesRes; // Particles???
  vec2 refract_uv = refracted.xy;
  float chroma_step = 0.01;

  vec3 chroma_sample =
      vec3(texture2D(uRefractionTex,
                     vec2(screen_uv + refract_uv * (1.0 + 1.0 * chroma_step)))
               .r,
           texture2D(uRefractionTex,
                     vec2(screen_uv + refract_uv * (1.0 + 2.0 * chroma_step)))
               .g,
           texture2D(uRefractionTex,
                     vec2(screen_uv + refract_uv * (1.0 + 3.0 * chroma_step)))
               .b);
  // // // // //


  // // // // // COLOR
  vec3 color_rgb = vec3(0.0);
  vec3 color_npos = data.pattern;
  vec3 color_noise = vec3(snoise(color_npos + vec3(0.5, 0.0, 0.0)),
                     snoise(color_npos + vec3(10.5, 0.0, 0.0)),
                     snoise(color_npos + vec3(20.5, 0.0, 0.0))) *
                    0.5 + 0.5;

  float color_contrast = 4.0;
  vec3 color_palette = mix(mix(uColor2, uColor3, gain(color_noise.x, color_contrast)),
                 mix(uColor4, uColor5, gain(color_noise.y, color_contrast)),
                 gain(pow(color_noise.z, 2.0), color_contrast));


  color_rgb = color_palette;
  vec4 color = vec4(color_rgb, 1.0);
  // // // // //


  // // // // // BUMP
  vec3 vor = voronoi3d(data.position * 20.0);
  float bump_scale = 0.5 + gain(pow(random(uSeed + 6.0), 2.0), 2.0);
  float bump_strength = random(uSeed + 8.0) * 0.5;
  bump_strength = gain(bump_strength, 3.0);

  vec3 norm = data.normal;
  vec3 nnp = data.position * bump_scale;

  vec3 newNorm = vec3(snoise(nnp + vec3(0.5, 0.0, 0.0)),
                       snoise(nnp + vec3(10.5, 0.0, 0.0)),
                       snoise(nnp + vec3(20.5, 0.0, 0.0))) *
                  2.0;

  float alignment = dot(normalize(newNorm), normalize(norm));
  norm = normalize(norm - newNorm * bump_strength);
  // // // // //


  // // // // // MATERIAL
  float roughness = 0.5;
  float emission = 0.0;
  float iridescence = 0.0;
  float metallic = 0.0;

  roughness = snoise(data.pattern*0.2 + vec3(0.0, 0.0, uSeed * 11.491)) * 0.5 + 0.5;
  roughness = gain(roughness, 4.0);

  emission = snoise(data.pattern + vec3(0.0, 0.0, uSeed * 13.4131)) * 0.5 + 0.5;
  emission = gain(pow(emission, 3.0), 2.0);

  iridescence = snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  iridescence = gain(pow(iridescence, 1.0), 1.0);

  metallic = snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  metallic = gain(pow(metallic, 2.0), 4.0);
  // // // // //


  // // // // // WIRE FRAME
  float scale = 1.0;
  #if IS_WIRES
    float wa = snoise(data.position * 0.5 + vec3(uSeed, 0.0, animation * 10.0)) * 0.5 + 0.5;
    color = vec4(uColor3, wa * 0.0);
  #else
  #endif
  // // // // //

  return CoatOutput(
    color,
    norm,
    scale,
    roughness,
    emission,
    iridescence,
    metallic
    );
}
