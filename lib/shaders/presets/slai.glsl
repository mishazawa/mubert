precision highp float;

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

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


vec3 pattern(in vec3 P, in float animation) {

  ////// Pre-distort
  vec3 pos = P;
  // pos = normalize(pos);
  //////


  ////// Parameters
  float tscale = pow(random(uSeed*0.855 + 19.0), 4.0);
  tscale = 0.1;
  float symmetry_n = floor(mix(1.0, 6.0, random(uSeed + 7.1282)));
  float vor_scale = pow(random(uSeed*0.821 + 74.0), 4.0) * 1.0;
  float simpx_scale = pow(random(uSeed*0.923 + 31.0), 4.0) * 1.0;
  float twist_amp = pow(random(uSeed*0.831 + 31.0), 6.0) * 2.0;
  float global_scale = mix(0.5, 2.0, random(uSeed + 3.115));
  float sinnoise_amp = pow(random(uSeed*0.943 + 68.0), 4.0) * 1.0;
  float sinnoise_freq = pow(random(uSeed*0.933 + 64.0), 6.0) * 1.0;

  // Npos pars
  // float simpx_amp =     0.00+random(uSeed*9.333 + 55.0)*0.5;
  // float vor_amp =       0.00+random(uSeed*3.534 + 64.0)*0.5;
  // float symmetry_amp =  0.00+random(uSeed*2.029 + 43.0)*0.5;
  // float py_val =        0.00+random(uSeed*5.432 + 67.0)*0.2;
  // float pos_val =       0.00+random(uSeed*0.444 + 98.0)*0.5;
  float simpx_amp =     pow(random(uSeed*0.855 + 19.0), 3.0);
  float vor_amp =       pow(random(uSeed*0.841 + 43.0), 1.0);
  float symmetry_amp =  pow(random(uSeed*0.821 + 39.0), 3.0);
  float py_val =        pow(random(uSeed*0.831 + 31.0), 1.0);
  float pos_val =       pow(random(uSeed*0.943 + 64.0), 4.0);





  /////// Compute
  // pos = sinnoise_distort(pos, sinnoise_amp, sinnoise_freq, vec3(animation*0.0, 0.0, uSeed));

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
  npos *= 0.2+random(uSeed+333.9)*0.2;



  vec2 auv = vec2(
    snoise(npos+vec3(0.0, 0.0, random(uSeed + 6.0) * 100.0)),
    snoise(npos+vec3(0.0, 0.0, random(uSeed + 9.0) * 100.0))
    ) * 0.5 + 0.5;
  float sub_scale = 0.25+random(uSeed + 88.0)*0.5;
  vec2 auv2 = vec2(
    snoise(npos*sub_scale+vec3(2.0, 0.0, random(uSeed + 7.0) * 100.0)),
    snoise(npos*sub_scale+vec3(2.0, 0.0, random(uSeed + 77.0) * 100.0))
    );
  auv = auv*1.0 + auv2*0.5*random(uSeed + 8.0);

  // vec2 auv = vec2(0.5, pos.y);
  auv = clamp(auv, 0.0, 1.0);

  // auv.x = 0.5;
  auv.y *= tscale;
  // auv.y = 1.0-auv.y; // flip y

  ////////// Apply UV
  float audio = texture(uAudioTex, auv).r;
  float ablur = blur13(uAudioTex, auv, vec2(128.0, 128.0), vec2(1.0, 1.0)*6.0).r;
  audio = mix(audio, ablur, float(VERTEX)>0.0); // blur only in fragment shader
  audio = mix(audio, ablur, 1.0); // blur only in fragment shader
  ///////////

  npos *= global_scale;
  // if (VERTEX==1) {
  //   npos *= 0.5;
  // }

  audio = smoothstep(0.0, 1.0, pow(audio, 1.0));
  
  vec3 patt = vec3(auv, audio);



  return patt;

}


vec3 displace(in vec3 P, in vec3 N, in vec3 patt, in float animation) {

  vec3 npos = P*pow(random(uSeed+5.41), 2.0)*0.5;
  npos = sinnoise_distort(npos, 0.5, 0.25, vec3(animation, 0.0, uSeed));

  vec3 ns = vec3(
    snoise(npos + vec3(0.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
    snoise(npos + vec3(10.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
    snoise(npos + vec3(20.5, 2.0, fract(uSeed / 1000.0) * 100.0))
    );
  float npatt = snoise(patt*2.0);

  // vec3 offset = N*(npatt) + ns*(npatt*0.5+0.5) * pow(random(uSeed+0.99331), 2.0);
  vec3 offset = N*(patt.z*2.0-1.0) + ns*(npatt*0.5+0.5)*1.0;
  // npatt = pow(patt.z, 2.0);
  // vec3 offset = normalize(N)*mix(-1.0, 1.0, npatt);

  vec3 new_pos = P + offset * 0.5;

  return new_pos;
}


//#include<calc_normal>
DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
                                       float animation) {
  Neighbours samples = getNeighbours(data.position, data.normal);
  vec3 patt = pattern(data.position, animation);
  vec3 p = displace(data.position, data.normal, patt, animation);
  vec3 pa = pattern(normalize(samples.a), animation);
  vec3 pb = pattern(normalize(samples.b), animation);
  vec3 n = calcNormalFromSamples(
      p, displace(normalize(samples.a), data.normal, pa, animation),
      displace(normalize(samples.b), data.normal, pb, animation));
  n = normalize(n);

  vec3 new_n = normalize(
    displace(data.position, normalize(data.position), patt, animation) -
    displace(data.position + normalize(data.position) * 0.01, normalize(data.position), patt, animation)
  );
  // n = new_n;
  // n = data.normal; // disable normal
  return DisplacePatternOutput(p, n, patt);
}


CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {


  // // // // // SETUP
  #if !VERTEX
  #define fragpos gl_FragCoord.xy
  #else
  #define fragpos vec2(0.0)
  #endif
  #if !VERTEX
  #define vWorldPosition_F vWorldPosition
  #else
  #define vWorldPosition_F vec3(0.0)
  #endif


  // // // // // // REFRACTION


  // vec2 screen_uv = vec2(0.0);
  // vec2 refract_uv = vec2(0.0);
  // float chroma_step = 0.01;

  // vec3 chroma_sample =
  //     vec3(texture2D(uRefractionTex,
  //                    vec2(screen_uv + refract_uv * (1.0 + 1.0 * chroma_step)))
  //              .r,
  //          texture2D(uRefractionTex,
  //                    vec2(screen_uv + refract_uv * (1.0 + 2.0 * chroma_step)))
  //              .g,
  //          texture2D(uRefractionTex,
  //                    vec2(screen_uv + refract_uv * (1.0 + 3.0 * chroma_step)))
  //              .b);

  // chroma_sample = vec3(refract_uv, 0.0);
  // // // // // //


  vec2      uViewport = vec2(uParticlesRes);      // screen size in pixels (width, height)
  float     uIOR = 1.9;           // index of refraction of the medium, e.g. 1.5
  float     uThickness = 50.0;     // refraction thickness/parallax scale in pixels (start e.g. 40.0)

  // Base screen UV for this pixel
  vec2 screen_uv = fragpos/vec2(uParticlesRes);

  // World-space view vector: surface -> camera
  vec3 V = normalize(cameraPosition - vWorldPosition_F);   // world
  vec3 N = normalize(vWorldNormal);                      // world

  // Refract the *incoming* ray toward the eye: use -V as incident
  float eta = 1.0 / uIOR; // air->glass (n1/n2); if you render from inside glass, flip
  vec3 R = refract(-V, N, eta);

  // Project refracted ray to screen UV offset (simple parallax approx).
  // Convert the world-space refracted direction into a view-facing basis
  // so XY maps to screen roughly. We build a tangent frame around V:
  vec3 up = abs(V.y) < 0.999 ? vec3(0.0, 1.0, 0.0) : vec3(0.0, 0.0, 1.0);
  vec3 T = normalize(cross(up, V));
  vec3 B = cross(V, T);

  // Components of refracted direction in that view-aligned basis:
  vec3 Rv = vec3(dot(R, T), dot(R, B), dot(R, V));

  // Parallax: how much screen shift per unit depth along view
  // (divide by forward component; clamp to avoid blowups at grazing angles)
  float denom = max(abs(Rv.z), 1e-3);
  vec2 refract_uv = (Rv.xy / denom) * (uThickness / uViewport); // pixels -> UV

  // Optional: fresnel to dampen at grazing angles (looks nicer)
  float F0 = pow((uIOR - 1.0) / (uIOR + 1.0), 2.0);
  float fresnel = F0 + (1.0 - F0) * pow(1.0 - max(dot(N, V), 0.0), 5.0);

  // Sample background with chromatic aberration (slight per-channel spread)
  float chroma = 0.1; // tweak 0..1
  float sscale = 1.0; // tweak 0..1
  vec3 col = vec3(
    texture(uRefractionTex, (screen_uv*2.0-1.0)*sscale*0.5+0.5 + refract_uv * (1.0 + 1.0*chroma)).r,
    texture(uRefractionTex, (screen_uv*2.0-1.0)*sscale*0.5+0.5 + refract_uv * (1.0 + 2.0*chroma)).g,
    texture(uRefractionTex, (screen_uv*2.0-1.0)*sscale*0.5+0.5 + refract_uv * (1.0 + 3.0*chroma)).b
  );

  // You can mix with your base material using fresnel if desired:
  // vec3 base = ...; // your shaded base color
  // col = mix(col, base, fresnel);

  // Output
  vec3 finalColor = col;
  // vec3 finalColor = col;
  // vec3 finalColor = texture(uRefractionTex, screen_uv).rga;
  // vec3 finalColor = vec3(screen_uv.x, screen_uv.y, 0.0);




  // // // // // COLOR
  vec3 color_rgb = vec3(0.0);
  float cnoise_scale = random(uSeed + 1.0);
  vec3 color_npos = data.pattern*mix(0.5,1.5,cnoise_scale)*2.0;
  vec3 color_noise = vec3(snoise(color_npos + vec3(0.5, 0.0, 0.0)),
                     snoise(color_npos + vec3(10.5, 0.0, 0.0)),
                     snoise(color_npos + vec3(20.5, 0.0, 0.0))) *
                    0.5 + 0.5;

  float color_contrast = 4.0;
  vec3 color_palette = mix(mix(uColor2, uColor3, gain(color_noise.x, color_contrast)),
                 mix(uColor4, uColor5, gain(color_noise.y, color_contrast)),
                 gain(pow(color_noise.z, 2.0), color_contrast));


  // color_rgb = color_palette;
  color_rgb = color_noise.rgb;

  // new_col = vec3(data.pattern.x);


  float mix_refract = data.pattern.z;
  // float mix_refract = 0.0;
  // mix_refract = gain(pow(mix_refract, 2.0), 3.0);
  // float lightness = color_noise.x;
  // lightness = gain(lightness, 2.0);



  vec3 new_col = color_rgb;
  // vec3 col_hsv = rgb2hsv(new_col);
  // col_hsv.z = lightness;
  // col_hsv.x += lightness*0.15;
  // new_col = hsv2rgb(col_hsv);



  new_col = color_palette;
  if (uUseTex) {
    // new_col = texture(uCustomTex, data.pattern.rg*mix(0.2,4.0,random(uSeed + 44.0))).xyz;
    new_col = texture(uCustomTex, color_noise.rg*0.25).xyz;
  }

  // new_col = mix(new_col, finalColor, mix_refract);
  float new_alpha = 1.0;


  vec4 color = vec4(new_col, new_alpha);
  // vec4 color = vec4(finalColor.rgb, 1.0);
  // color = vec4(0.0);
  // // // // //


  // // // // // BUMP
  vec3 vor = voronoi3d(data.position * 20.0);
  float bump_scale = 0.5 + gain(pow(random(uSeed + 6.0), 2.0), 2.0);
  float bump_strength = random(uSeed + 8.0) * 0.5;
  bump_strength = gain(bump_strength, 3.0);

  vec3 norm = normalize(data.normal);
  vec3 nnp = data.position * bump_scale;

  vec3 newNorm = vec3(snoise(nnp + vec3(0.5, 0.0, 0.0)),
                       snoise(nnp + vec3(10.5, 0.0, 0.0)),
                       snoise(nnp + vec3(20.5, 0.0, 0.0))) *
                  2.0;

  float alignment = dot(normalize(newNorm), normalize(norm));
  norm = normalize(norm - newNorm * bump_strength);
  // // // // //


  // // // // // MATERIAL
  float roughness = 1.0;
  float emission = 0.0;
  float iridescence = 0.0;
  float metallic = 0.0;

  roughness = snoise(data.pattern*0.2 + vec3(0.0, 0.0, uSeed * 11.491)) * 0.5 + 0.5;
  roughness = gain(pow(roughness, mix(0.2,4.0,random(uSeed+2.31133))), 2.0);
  roughness = mix(0.25, 1.0, roughness);

  emission = snoise(data.pattern + vec3(0.0, 0.0, uSeed * 13.4131)) * 0.5 + 0.5;
  emission = gain(pow(emission, mix(0.1,0.5,random(uSeed+2.31133))), 4.0);

  iridescence = snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  iridescence = gain(pow(iridescence, 1.0), 1.0);

  metallic = snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  metallic = gain(pow(metallic, 2.0), 4.0);
  metallic = mix(0.0, 0.99, metallic);
  // // // // //


  // // // // // WIRE FRAME
  float scale = 1.0;
  #if IS_WIRES
    float wa = snoise(vPosition * 1.0 + vec3(uSeed, 0.0, animation * 10.0)) * 0.5 + 0.5;
    color = vec4(mix(uColor1, uColor5, gain(wa, 2.0)), 1.0);
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
