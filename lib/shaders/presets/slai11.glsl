precision highp float;



#define SPEED .01
#define FREQ 1.

#define NORMAL_OFFSET 0.1

//#include<math>
//#include<noise3>
//#include<voronoi3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>

vec3 pattern(in vec3 P, in float animation) {

  vec3 pos = P;

  ////// Parameters
  float tscale = pow(random(uSeed*0.855 + 19.0), 4.0);
  // tscale = 0.1;
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
  float simpx_amp =     pow(random(uSeed*0.855 + 19.0), 3.0) * 1.0;
  float vor_amp =       pow(random(uSeed*0.841 + 43.0), 1.0) * 1.0;
  float symmetry_amp =  pow(random(uSeed*0.821 + 39.0), 3.0) * 0.2;
  float py_val =        pow(random(uSeed*0.831 + 31.0), 3.0) * 0.25;
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

  float simpx = snoise(pos*simpx_scale+vec3(0.0, fract(animation) * 10.0, uSeed * 10.0)) * 0.5 + 0.5;
  vec3 vor = voronoi3d(pos*vor_scale+vec3(0.0, random(uSeed) + fract(animation) * 10.0, 0.0));
  float vor_idr = random(uSeed + vor.z*10.0);
  float vor_dist = smoothstep(0.0, 1.0, vor.x);


  vec3 npos = vec3(
    pos.y * py_val*2.0,
    symmetry * symmetry_amp,
    vor_dist * vor_amp + simpx * simpx_amp
  );
  npos = sinnoise_distort(npos, 0.2, 0.25, vec3(fract(animation*0.1)*10.0, 0.0, uSeed));
  // npos += pos * pos_val;
  npos *= 0.2+random(uSeed+333.9)*0.2;
  // npos *= 0.1;
  // vec3 npos = pos;



  vec2 auv = vec2(
    snoise(npos+vec3(0.0, 0.0, (random(uSeed + 6.0) * 100.0))),
    snoise(npos+vec3(0.0, 0.0, (random(uSeed + 9.0) * 100.0)))
    ) * 0.5 + 0.5;

  // vec2 auv = sinnoise_distort(npos*0.1, 0.0, 0.5, vec3(0.0)).xy;
  // npos = sinnoise_distort(npos*0.2, 0.25, 0.75, vec3(0.0));
  // vec2 auv = npos.xy*vec2(1.0, 1.0);
  // auv = auv*0.5+0.5;

  float sub_scale = 0.25+random(uSeed + 88.0)*0.5;
  vec2 auv2 = vec2(
    snoise(npos*sub_scale+vec3(2.0, 0.0, (random(uSeed + 7.0) * 100.0))),
    snoise(npos*sub_scale+vec3(2.0, 0.0, (random(uSeed + 77.0) * 100.0)))
    );
  auv = auv*1.0 + auv2*0.5*random(uSeed + 8.0);

  // vec2 auv = vec2(0.5, pos.y);
  auv = clamp(auv, 0.0, 1.0);

  // auv.x = 0.5;
  auv.y *= tscale;
  // auv.y = 1.0-auv.y; // flip y

  ////////// Apply UV
  // float audio = textureLod(uAudioTex, auv, 2.0).r;
  
  // vec2 px = vec2(1.0 / float(textureSize(uAudioTex, 0).x), 0.0);
  // float a0 = texture(uAudioTex, auv - 2.0*px).r;
  // float a1 = texture(uAudioTex, auv - 1.0*px).r;
  // float a2 = texture(uAudioTex, auv).r;
  // float a3 = texture(uAudioTex, auv + 1.0*px).r;
  // float a4 = texture(uAudioTex, auv + 2.0*px).r;
  // float audio = (a0 + 4.0*a1 + 6.0*a2 + 4.0*a3 + a4) / 16.0; // 1D Gaussian
  
  // float audio = texture(uAudioTex, auv).r;
  float audio = textureLod(uAudioTex, auv, 0.5).r;
  // float audio = blur13(uAudioTex, auv, vec2(256.0, 256.0), vec2(1.0, 1.0)*1.0).r;
  // audio = mix(audio, ablur, float(VERTEX)>0.0); // blur only in fragment shader
  // audio = mix(audio, ablur, 1.0); // blur only in fragment shader
  ///////////

  npos *= global_scale;
  // if (VERTEX==1) {
  //   npos *= 0.5;
  // }

  audio = smoothstep(0.0, 1.0, pow(audio, 1.0));
  
  vec3 patt = vec3(auv*1.0, audio*1.0);

  return patt.xyz;

}



vec3 displace(in vec3 P, in vec3 N, in vec3 patt, in float animation) {

  vec3 npos = P;


  // npos *= mix(0.1, 1.0, patt.z);
  // npos = sinnoise_distort(npos, 0.5, 0.75, vec3(fract(animation*0.2), 0.0, fract(uSeed)));

  vec3 ns = vec3(
    snoise(npos + vec3(0.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
    snoise(npos + vec3(10.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
    snoise(npos + vec3(20.5, 2.0, fract(uSeed / 1000.0) * 100.0))
    );
  float npatt = snoise(patt*2.0);
  // npos += ns;

  // vec3 offset = N*(npatt) + ns*(npatt*0.5+0.5) * pow(random(uSeed+0.99331), 2.0);
  // vec3 offset = N*(patt.z*2.0-1.0) + ns*(npatt*0.5+0.5)*1.0;
  // vec3 offset = ns;
  // npatt = pow(patt.z, 2.0);
  vec3 offset = normalize(N)*mix(-0.5, 1.0, npatt);

  vec3 new_pos = npos+offset*0.5;
  // new_pos = P;

  return new_pos;
}



// vec3 orthogonal(vec3 v) {
//     return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
//     : vec3(0.0, -v.z, v.y));
// }

// vec3 orthogonal(vec3 n) {
//     float s = n.z >= 0.0 ? 1.0 : -1.0;
//     float a = -1.0 / (s + n.z);
//     float bxy = n.x * n.y * a;
//     return normalize(vec3(1.0 + s * n.x * n.x * a, s * bxy, -s * n.x));
// }

vec3 orthogonal(vec3 n) {
    // Seam-free except at y = -1
    if (n.y < -0.9999999)
        return vec3(0.0, 0.0, -1.0);   // stable fallback direction

    float a = 1.0 / (1.0 + n.y);
    float b = -n.x * n.z * a;
    return normalize(vec3(1.0 - n.x * n.x * a, -n.x, b));
}


// Frisvad (2012): Building an Orthonormal Basis, Revisited
// Returns tangent (t) and bitangent (b) given unit normal n.
// void make_tangent_basis(in vec3 n, out vec3 t, out vec3 b) {
//   float s = n.z >= 0.0 ? 1.0 : -1.0;
//   float a = -1.0 / (s + n.z);
//   float bxy = n.x * n.y * a;
//   t = normalize(vec3(1.0 + s * n.x * n.x * a, s * bxy, -s * n.x));
//   b = normalize(cross(n, t));
// }

// Seam-free orthonormal basis (Frisvad 2012, corrected)
void make_tangent_basis(in vec3 n, out vec3 t, out vec3 b)
{
    if (n.z < -0.9999999) {
        t = vec3(0.0, -1.0, 0.0);
        b = vec3(-1.0,  0.0, 0.0);
    } else {
        float a = 1.0 / (1.0 + n.z);
        float b_factor = -n.x * n.y * a;
        t = vec3(1.0 - n.x * n.x * a, b_factor, -n.x);
        b = vec3(b_factor, 1.0 - n.y * n.y * a, -n.y);
    }
}


// #include<calc_normal>
DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
                                       float animation) {

  vec3 position = data.position;
  vec3 normal = data.normal;

  vec3 patt = pattern(position, animation);
  vec3 new_pos = displace(position, normal, patt, animation);

  float offset = NORMAL_OFFSET;
  vec3 tangent = orthogonal(normal);
  vec3 bitangent = normalize(cross(normal, tangent));
  vec3 neighbour1 = position + tangent * offset;
  vec3 neighbour2 = position + bitangent * offset;

  vec3 patt1 = pattern(neighbour1, animation);
  vec3 patt2 = pattern(neighbour2, animation);

  vec3 displacedNeighbour1 = displace(neighbour1, normal, patt1, animation);
  vec3 displacedNeighbour2 = displace(neighbour2, normal, patt2, animation);

  vec3 displacedTangent = displacedNeighbour1 - new_pos;
  vec3 displacedBitangent = displacedNeighbour2 - new_pos;

  vec3 new_normal = normalize(cross(displacedTangent, displacedBitangent));

  return DisplacePatternOutput(new_pos, new_normal, patt);
}

// DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
//                                        float animation) {
//   vec3 p = data.position;
//   vec3 n = normalize(data.normal);

//   vec3 patt = pattern(p, animation);
//   vec3 pNew = displace(p, n, patt, animation);

//   vec3 T, B;
//   make_tangent_basis(n, T, B);

//   float offset = 0.05;
//   vec3 p1 = p + T * offset;
//   vec3 p2 = p + B * offset;

//   vec3 patt1 = pattern(p1, animation);
//   vec3 patt2 = pattern(p2, animation);

//   vec3 pNew1 = displace(p1, n, patt1, animation);
//   vec3 pNew2 = displace(p2, n, patt2, animation);

//   vec3 dT = pNew1 - pNew;
//   vec3 dB = pNew2 - pNew;

//   vec3 nNew = normalize(cross(dT, dB));

//   return DisplacePatternOutput(pNew, nNew, patt);
// }


CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {



  // // // // // SETUP
  #if !VERTEX
  #define fragpos gl_FragCoord.xy
  #else
  #define fragpos vec2(0.0)
  #endif
  #if !VERTEX
  #define vWorldPosition_F vWorldPosition

    vec3 new_n = vec3(0.0);
    // vec3 dpdx = dFdx(vWorldPosition_F);
    // vec3 dpdy = dFdy(vWorldPosition_F);
    vec3 dpdx = dFdx(data.position);
    vec3 dpdy = dFdy(data.position);
    // vec3 dpdx = dFdx(data.position);
    // vec3 dpdy = dFdy(data.position);
    new_n = normalize(cross(dpdx, dpdy));
    // data.normal = new_n;
    // data.normal = vNormalD;


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
    vec2 tex_uv = vec2(color_noise.rg)*vec2(0.5);
    // new_col = texture(uCustomTex, data.pattern.rg*mix(0.2,4.0,random(uSeed + 44.0))).xyz;
    new_col = texture(uCustomTex, tex_uv).xyz;
  }

  // new_col = mix(new_col, finalColor, mix_refract);
  float new_alpha = 1.0;


  // new_col = vec3(1.0);

  vec4 color = vec4(new_col, new_alpha);
  // color = vec4(data.normal, new_alpha);
  // vec4 color = vec4(finalColor.rgb, 1.0);
  // color = vec4(0.0);
  // // // // //


  // // // // // BUMP


  // vec3 vor = voronoi3d(data.position * 20.0);
  // float bump_scale = 0.5 + gain(pow(random(uSeed + 6.0), 2.0), 2.0);
  // float bump_strength = random(uSeed + 8.0) * 0.5;
  // bump_strength = gain(bump_strength, 3.0);
  vec3 norm = normalize(data.normal);
  // if (data.position.z < 0.0) {
  //   norm = -norm;
  // }
  // vec3 nnp = data.position * bump_scale;

  // vec3 newNorm = vec3(snoise(nnp + vec3(0.5, 0.0, 0.0)),
  //                      snoise(nnp + vec3(10.5, 0.0, 0.0)),
  //                      snoise(nnp + vec3(20.5, 0.0, 0.0))) *
  //                 2.0;

  // float alignment = dot(normalize(newNorm), normalize(norm));
  // norm = normalize(norm - newNorm * bump_strength);


  // // // // //


  // // // // // MATERIAL
  float roughness = 0.0;
  float emission = 0.0;
  float iridescence = 0.0;
  float metallic = 1.0;

  roughness = snoise(data.pattern*0.2 + vec3(0.0, 0.0, uSeed * 11.491)) * 0.5 + 0.5;
  roughness = gain(pow(roughness, mix(0.2,4.0,random(uSeed+2.31133))), 2.0);
  roughness = mix(0.25, 1.0, roughness);

  emission = snoise(smoothstep(0.5, 1.0, length(color)) + vec3(0.0, 0.0, uSeed * 13.4131)) * 0.5 + 0.5;
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
