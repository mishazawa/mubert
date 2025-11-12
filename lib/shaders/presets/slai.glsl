precision highp float;

// TODO
#define SPEED .02
#define FREQ 3.

#define NORMAL_OFFSET 0.05

// Fragment-specific inputs
#if !VERTEX
#define fragpos gl_FragCoord.xy
#define vWorldPosition_F vWorldPosition
uniform mat3 normalMatrix;
#else
#define fragpos vec2(0.0)
#define vWorldPosition_F vec3(0.0)
#endif

uniform mat4 cameraMatrixWorld;

// uniform mat4 viewMatrix;


//#include<math>
//#include<noise3>
//#include<voronoi3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>


// robust hash for grid corners
float hash3(vec3 p) {
    // IQ-style hash
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

// === Value noise with derivatives ===
vec4 noised(in vec3 x)
{
    vec3 p = floor(x);
    vec3 w = fract(x);

    // quintic fade and its derivative
    vec3 u  = w*w*w*(w*(w*6.0 - 15.0) + 10.0);
    vec3 du = 30.0*w*w*(w*(w - 2.0) + 1.0);   // <-- fixed

    float a = 2.0*hash3(p+vec3(0,0,0)) - 1.0;
    float b = 2.0*hash3(p+vec3(1,0,0)) - 1.0;
    float c = 2.0*hash3(p+vec3(0,1,0)) - 1.0;
    float d = 2.0*hash3(p+vec3(1,1,0)) - 1.0;
    float e = 2.0*hash3(p+vec3(0,0,1)) - 1.0;
    float f = 2.0*hash3(p+vec3(1,0,1)) - 1.0;
    float g = 2.0*hash3(p+vec3(0,1,1)) - 1.0;
    float h = 2.0*hash3(p+vec3(1,1,1)) - 1.0;

    float k0 = a;
    float k1 = b - a;
    float k2 = c - a;
    float k3 = e - a;
    float k4 = a - b - c + d;
    float k5 = a - c - e + g;
    float k6 = a - b - e + f;
    float k7 = -a + b + c - d + e - f - g + h;

    float val = k0
              + k1*u.x + k2*u.y + k3*u.z
              + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x
              + k7*u.x*u.y*u.z;

    vec3 grad = du * vec3(
        k1 + k4*u.y + k6*u.z + k7*u.y*u.z,
        k2 + k5*u.z + k4*u.x + k7*u.z*u.x,
        k3 + k6*u.x + k5*u.y + k7*u.x*u.y
    );

    return vec4(2.0*val - 1.0, 2.0*grad); // map to [-1,1] like yours
}





//===[ UTILS ]===//

vec2 unfoldUV(vec2 uv) {
    return 1.0 - abs(fract(uv) * 2.0 - 1.0);
}

vec3 orthogonal(vec3 n) {
    // Seam-free except at y = -1
    if (n.y < -0.9999999)
        return vec3(0.0, 0.0, -1.0);
    float a = 1.0 / (1.0 + n.y);
    float b = -n.x * n.z * a;
    return normalize(vec3(1.0 - n.x * n.x * a, -n.x, b));
}

void make_tangent_basis(in vec3 n, out vec3 t, out vec3 b) {
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



//===[ SHAPE ]===//

vec3 get_pattern(in vec3 P, in float animation) {

  vec3 pos = P;
  animation = fract(animation);
  float anim_freq = 1.0;
  vec2 anim_loop = vec2(sin(animation*anim_freq*PI*2.0), cos(animation*anim_freq*PI*2.0));

  float sin_dist_val = mix(0.0, 0.5, random(uSeed + 92.76));

  pos = sinnoise_distort(pos, sin_dist_val, 0.5, vec3(anim_loop, uSeed));

  vec2 vor_scale_range = vec2(0.3, 0.8);
  float vor_scale = mix(vor_scale_range.x, vor_scale_range.y, random(uSeed + 17.98));
  vec3 vor = voronoi3d(pos*vor_scale+vec3(anim_loop, uSeed).xzy);
  float vor_dist = gain(vor.x, 2.0);
  vec3 vor_npos = vec3(0.0, 0.0, vor_dist);

  vec2 npos_scale_range = vec2(0.1, 0.5);
  float npos_scale = mix(npos_scale_range.x, npos_scale_range.y, random(uSeed + 34.14));
  vec3 pos_npos = pos*npos_scale + vec3(anim_loop, uSeed);

  float npos_mix = random(uSeed + 51.27);

  vec3 npos = mix(pos_npos, vor_npos, npos_mix);

  vec2 auv = vec2(
    snoise(npos+vec3(0.0, 0.0, (random(uSeed + 6.9) * 100.0))),
    snoise(npos+vec3(0.0, 0.0, (random(uSeed + 9.6) * 100.0)))
  );

  auv = auv * 0.5 + 0.5;
  auv = unfoldUV(auv);
  auv = vec2(mix(0.06, 0.66, auv.x), auv.y);
  float audio = texture(uAudioTex, auv).r;
  audio = pow(audio, 1.2);
  audio = smoothstep(0.0, 1.0, audio);
  vec3 patt = vec3(auv, audio);

  float debug_ax = P.y*2.0;
  float debug_ay = P.x*2.0;
  debug_ax = debug_ax * 0.5 + 0.5;
  debug_ay = debug_ay * 0.5 + 0.5;
  debug_ax = clamp(debug_ax, 0.0, 1.0);
  debug_ay = clamp(debug_ay, 0.0, 1.0);
  float debug = texture(uAudioTex, vec2(mix(0.0, 0.7, debug_ax), debug_ay)).r;
  debug = pow(debug, 2.0);
  // patt.z = debug;

  return patt;

}


vec3 displace(in vec3 P, in vec3 N, in vec3 patt, in float animation) {


  vec3 disp_pos = P;
  float disp_depth = mix(0.2, 0.9, random(uSeed*10.34));
  disp_pos = disp_pos*(1.0-disp_depth) + N * patt.z * disp_depth;

  // npos *= mix(0.1, 1.0, patt.z);
  vec3 npos = patt * vec3(1.0, 1.0, 0.0)*0.5;
  vec3 npos2 = P*0.2;
  float npos_mix = random(uSeed*20.67);
  npos = mix(npos, npos2, npos_mix);

  vec3 ns = vec3(
    snoise(npos + vec3(0.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
    snoise(npos + vec3(10.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
    snoise(npos + vec3(20.5, 2.0, fract(uSeed / 1000.0) * 100.0))
    );
  

  // === Build local frame (TBN) ===
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 tangent = normalize(cross(up, N)); // perpendicular to up and N
  vec3 bitangent = normalize(cross(N, tangent));
  mat3 TBN = mat3(tangent, bitangent, N);

  float alignment = abs(dot(N, vec3(0.0, 1.0, 0.0))); // 1 = pointing up/down
  float fade = smoothstep(0.7, 1.0, alignment);       // fade out near poles
  float noise_strength = mix(1.0, 0.0, fade);         // full in middle, none near top


  ns = ns * 0.5 + 0.5; // map to [0,1]
  // === Apply noise in that local frame ===
  // vec3 ns_local = ns*0.5*patt.z;               // scale noise strength
  vec3 ns_local = ns*patt.z*noise_strength;               // scale noise strength
  vec3 ns_world = TBN * ns_local;         // rotate into world space
  // vec3 ns_world = ns_local;         // rotate into world space

  // === Combine with normal-based displacement ===
  float dstrength = random(uSeed*32.23)*0.5;
  dstrength;
  // vec3 new_pos = P*(1.0-dstrength) + N * patt.z * dstrength + ns_world;
  vec3 new_pos = disp_pos*(1.0-dstrength) + dstrength * ns_world;
  // new_pos = disp_pos;

  return new_pos;
}




//===[ GET SHAPE & NORMALS ]===//

DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
                                       float animation) {
  vec3 position = data.position;
  vec3 normal = data.normal;

  vec3 pattern = get_pattern(position, animation);
  vec3 new_pos = displace(position, normal, pattern, animation);

  if (!uCalcNormals) {
    return DisplacePatternOutput(new_pos, normal, pattern);
  }

  float n_offset = NORMAL_OFFSET;
  vec3 tangent = orthogonal(normal);
  vec3 bitangent = normalize(cross(normal, tangent));
  vec3 neighbour1 = position + tangent * n_offset;
  vec3 neighbour2 = position + bitangent * n_offset;

  vec3 pattern1 = get_pattern(neighbour1, animation);
  vec3 pattern2 = get_pattern(neighbour2, animation);

  vec3 displacedNeighbour1 = displace(neighbour1, normal, pattern1, animation);
  vec3 displacedNeighbour2 = displace(neighbour2, normal, pattern2, animation);

  vec3 displacedTangent = displacedNeighbour1 - new_pos;
  vec3 displacedBitangent = displacedNeighbour2 - new_pos;
  vec3 new_normal = normalize(cross(displacedTangent, displacedBitangent));

  return DisplacePatternOutput(new_pos, normal, pattern);
}


CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {

  vec3 norm = data.normal;


  /////////////// [ BUMP ] /////////////
  // float bump_scale = 3.0; // TODO: randomize
  // float bump_strength = 0.0; // TODO: randomize

  // vec3 nnp = mix(data.position, data.pattern, 0.0);
  // nnp = sinnoise_distort(nnp, 0.3, 2.0, vec3(fract(animation)*1.0, 0.0, uSeed));
  // nnp *= bump_scale;

  // vec4 bump_noise = noised(nnp);
  // vec3 newNorm = bump_noise.yzw;
  // norm = normalize(norm - newNorm * bump_strength);
  ////////////////////////////////////////




  ///////////////////////////////////
  // === Refraction + Reflection ===
  float uIOR = 1.05;

  // Setup parameters
  vec2 uViewport = vec2(textureSize(uCustomTex, 0));
  // World-space vectors
  vec3 Pw = data.position;
  vec3 Nw = normalize(data.normal);
  vec3 cam_pos = normalize(cameraPosition)*15.0;
  vec3 Vw = normalize(cam_pos - Pw);

  // Fresnel in world space
  float F0 = pow((uIOR - 1.0) / (uIOR + 1.0), 2.0);
  float fresnel = F0 + (1.0 - F0) * pow(1.0 - clamp(dot(Nw, Vw), 0.0, 1.0), 5.0);

  // Refraction / Reflection vectors in world space
  float eta = 1.0 / uIOR;
  vec3 Iw = -Vw; // incident vector from camera to surface
  // vec3 refraction_vec = refract(Iw, Nw, eta);
  vec3 refraction_vec = refract(Iw, Nw, eta);

  // refraction_vec = Vw2;
  vec3 reflection_vec = reflect(Iw, Nw);
  

  // Sample both
  vec2 uv_reflect = ctob(reflection_vec);
  uv_reflect = uv_reflect * 2.0 + 1.0;
  uv_reflect *= 1.2;
  uv_reflect = uv_reflect * 0.5 + 0.5;
  uv_reflect = unfoldUV(uv_reflect);

  vec2 uv_refract = ctob(refraction_vec);
  uv_refract = uv_refract * 2.0 + 1.0;
  uv_refract *= 1.2;
  uv_refract = uv_refract * 0.5 + 0.5;
  uv_refract = unfoldUV(uv_refract);

  vec3 col_reflect = texture(uCustomTex, uv_reflect).rgb;
  vec3 col_refract = texture(uCustomTex, uv_refract).rgb;

  col_reflect *= pow(fresnel, 5.0);

  ///////////////////////////////////////////////////
  

  // === [ COLOR ] === //

  // Color noise mapping
  float cnoise_scale = random(uSeed + 1.0);
  vec3 color_npos = data.pattern*mix(0.5,1.5,cnoise_scale)*2.0;
  vec3 color_noise = vec3(snoise(color_npos + vec3(0.5, 0.0, 0.0)),
                     snoise(color_npos + vec3(10.5, 0.0, 0.0)),
                     snoise(color_npos + vec3(20.5, 0.0, 0.0))) *
                    0.5 + 0.5;

  vec3 color_rgb;

  if (uUseTex) {
    // === Texture color mapping === //

    float mix_cmap = random(uSeed + 83.1415);
    float tex_uv_weight = mix_cmap;
    float tex_patt_weight = (1.0-mix_cmap)*0.5;
    vec3 tex_npos = data.pattern*vec3(tex_uv_weight, tex_uv_weight, tex_patt_weight);
    vec2 tex_uv = vec2(
      snoise(tex_npos + vec3(0.0, 0.0, uSeed+9.6)),
      snoise(tex_npos + vec3(0.0, 0.0, uSeed+6.9))
    )*0.5+0.5;
    vec2 tex_uv2 = vec2(
      snoise(tex_npos + vec3(89.82, 0.0, uSeed+9.6)),
      snoise(tex_npos + vec3(89.82, 0.0, uSeed+6.9))
    )*0.5+0.5;

    vec3 color_texture = texture(uCustomTex, tex_uv).xyz;
    vec3 color_texture2 = texture(uCustomTex, tex_uv2).xyz;
    float mix_colors = gain(data.pattern.z, 4.0);
    color_texture = mix(color_texture, color_texture2, mix_colors);

    color_rgb = color_texture;


    // ------------------------------//
  } else {
    // === Palette color mapping === //


    float color_contrast = 4.0;
    vec3 color_palette = mix(mix(uColor2, uColor3, gain(color_noise.x, color_contrast)),
                  mix(uColor4, uColor5, gain(color_noise.y, color_contrast)),
                  gain(pow(color_noise.z, 2.0), color_contrast));

    color_rgb = color_palette;


    // ------------------------------//
  }

  vec3 final_color = color_rgb;
  ////////////////////////////////////



  // === [ COLOR COMPOSITING ] === //


  // Add reflection

  // Simulate AO

  float refraction_mask = smoothstep(0.5,0.0,length(color_rgb));
  // refraction_mask = 1.0;
  final_color *= mix(0.5, 2.0, pow(data.pattern.z, 0.5));
  if (uUseTex) {
    final_color = mix(final_color, col_refract, refraction_mask);
    final_color += col_reflect;
  }

  // final_color = col_refract;

  vec4 color = vec4(final_color, 1.0);

  ///////////////////////////////////






  // // // // // MATERIAL
  float roughness = 0.2;
  float emission = 0.0;
  float iridescence = 0.0;
  float metallic = 0.0;

  roughness = snoise(data.pattern*0.2 + vec3(0.0, 0.0, uSeed * 11.491)) * 0.5 + 0.5;
  roughness = gain(pow(roughness, mix(0.2,4.0,random(uSeed+2.31133))), 2.0);
  roughness = mix(0.0, 1.0, roughness);

  emission = snoise(smoothstep(0.5, 1.0, length(color)) + vec3(0.0, 0.0, uSeed * 13.4131)) * 0.5 + 0.5;
  emission = gain(pow(emission, mix(2.0,4.0,random(uSeed+2.31133))), 4.0);
  emission = max(emission, refraction_mask);

  iridescence = snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  iridescence = gain(pow(iridescence, 1.0), 1.0);

  metallic = snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  metallic = gain(pow(metallic, 2.0), 4.0);
  metallic = mix(0.0, 0.99, metallic);

  // // // // //


  // // // // // WIRE FRAME
  float scale = 1.0;
  // #if IS_WIRES
  //   float wa = snoise(vPosition * 1.0 + vec3(uSeed, 0.0, animation * 10.0)) * 0.5 + 0.5;
  //   color = vec4(mix(uColor1, uColor5, gain(wa, 2.0)), 1.0);
  // #else
  // #endif
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
