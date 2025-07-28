#define DIST_AMP 5.
#define NOISE_DIST_AMP 1.
#define SPEED .1
#define FREQ 1.
#define FRAC_SCALE 16
#define DISPLACE_SCALE 2.0
#define DISPLACE_POS_SCALE 0.5

precision highp float;

//#include<math>
//#include<noise3>
//#include<voronoi3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>

#if VERTEX
#define modelmat mat4(1.0)
#define fragpos vec2(0.0)
#else

#define modelmat v_mmat
#define fragpos gl_FragCoord.xy
#endif

vec3 pattern_(in vec3 P, in float animation) {
  return drawAudioLines(vec3(.0), generateSyncedPosition(P), animation) *
         DIST_AMP * uDisplacementAmplitude;
}

vec3 displace(in vec3 P, in vec3 N, in float animation) {
  vec3 mask = vec3(1.0);
  vec3 newPosition = P + N * mask;
  return newPosition + noiseDistortion(newPosition, mask.x, animation);
}

vec3 displace_(in vec3 P, in vec3 N, in vec3 patt, in float animation) {

  vec3 mask = vec3(length(patt));
  mask = smoothstep(-1.0, 1.0, mask);

  float PHASE = animation * 1.0 + fract(uSeed / 100.0) * 100.0;
  float strength = random(uSeed + 1.0) * 0.5;
  strength = 1.0;
  float freq = 0.2 + random(uSeed + 2.5) * 0.5;
  float gainn = 1.0 + random(uSeed + 3.5) * 3.0;

  float noise3 = snoise(patt + N * freq * 0.2 - 3.3 + vec3(0.0, 0.0, PHASE));
  float noise4 = snoise(patt - 4.4 + vec3(0.0, 0.0, -PHASE));
  vec3 newPosition = P + N * (noise3 * 0.5);

  vec3 pos_ = newPosition;
  vec3 npos2 = pos_ * freq;
  vec3 noise2 = vec3(snoise(npos2 + 11.1 + vec3(0.0, 0.0, PHASE)),
                     snoise(npos2 + 22.2 + vec3(0.0, PHASE, 0.0)),
                     snoise(npos2 + 33.3 + vec3(PHASE, 0.0, 0.0)));
  vec3 newpos_ = pos_;
  float ss = noise3 * 0.5 + 0.5;
  ss *= 0.2;
  newpos_.xy = rotate2d(newpos_.xy, noise2.x * strength * ss);
  newpos_.yz = rotate2d(newpos_.yz, noise2.y * strength * ss);
  newpos_.xz = rotate2d(newpos_.xz, noise2.z * strength * ss);
  newpos_ += noise2 * 0.1 * ss;
  // noise2 = vec3(
  //     gain(noise2.x*0.5+0.5, gainn),
  //     gain(noise2.y*0.5+0.5, gainn),
  //     gain(noise2.z*0.5+0.5, gainn)
  //   )*2.0-1.0;
  newPosition = newpos_;

  newPosition = P * DISPLACE_POS_SCALE * 0.0 + patt * 8.0 * DISPLACE_SCALE;
  newPosition =
      P +
      vec3(snoise(newPosition + vec3(0.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
           snoise(newPosition + vec3(10.5, 2.0, fract(uSeed / 1000.0) * 100.0)),
           snoise(newPosition +
                  vec3(20.5, 2.0, fract(uSeed / 1000.0) * 100.0))) *
          (0.2 + random(uSeed + 4.0) * 0.2);

  return newPosition;
}

//#include<calc_normal>

DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
                                       float animation) {
  Neighbours samples = getNeighbours(data.position, data.normal);

  vec3 patt = pattern_(data.position, animation);

  // vec3 p = data.position;
  // vec3 n = data.normal;

  vec3 p = displace_(data.position, data.normal, patt, animation);
  vec3 n = calcNormalFromSamples(
      p, displace_(samples.a, data.normal, patt, animation),
      displace_(samples.b, data.normal, patt, animation));

  // return DisplacePatternOutput(data.position, data.normal, patt);
  return DisplacePatternOutput(p, n, patt);
}

CoatOutput coat_pattern(in DisplacePatternOutput data, float animation) {
  vec3 background = mix(uColor1, vec3(uColorKeyValue), uUseColorKey);
  // vec3 newColor = mix(background, uColor2,  data.pattern);
  vec3 newColor = data.pattern;

  float roughness =
      snoise(data.pattern - 3.3 + vec3(0.0, 0.0, uSeed * 10.0)) * 0.5 + 0.5;
  roughness = gain(roughness, 1.0);
  float emission =
      snoise(data.pattern - 4.4 + vec3(0.0, 0.0, uSeed * 20.0)) * 0.5 + 0.5;
  emission = gain(emission, 2.0);
  float iridescence =
      snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  iridescence = gain(pow(iridescence, 1.0), 1.0);
  float metallic =
      snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  metallic = gain(pow(metallic, 1.0), 1.0);

  // vec3 opos = (modelmat * vec4(data.position, 1.0)).xyz;

  vec3 opos = (viewMatrix * vec4(data.position, 1.0)).xyz;
  // vec3 opos = data.position;
  // vec3 viewDir = normalize(cameraPosition - opos);
  vec3 viewDir = normalize(vec3(0.0) - opos);
  float fresnel =
      pow(1.0 - max(dot(normalize(data.normal), normalize(viewDir)), 0.0), 2.0);

  vec3 reflected = reflect(viewDir, normalize(data.normal));
  float eta = 1.0 / 1.5; // air to glass
  vec3 refracted = refract(viewDir, normalize(data.normal), eta);

  vec2 ruv = ctob(refracted);
  ruv = vec2(viewDir.x, viewDir.y) * 10.0;
  // ruv = fract(ruv * 10.0);
  vec3 rcol =
      pattern_(vec3(viewDir.xy * 0.0, 0.0) * 0.0, animation * 0.0) * 0.0;
  newColor = rcol * 0.0;

  vec2 screen_uv = fragpos / uParticlesRes;
  float chroma_step = 0.01;
  vec3 refColor =
      vec3(texture2D(uRefractionTex,
                     vec2(screen_uv + reflected.xy * (1.0 + 1.0 * chroma_step)))
               .r,
           texture2D(uRefractionTex,
                     vec2(screen_uv + reflected.xy * (1.0 + 2.0 * chroma_step)))
               .g,
           texture2D(uRefractionTex,
                     vec2(screen_uv + reflected.xy * (1.0 + 3.0 * chroma_step)))
               .b);
  //   newColor = refColor;

  vec3 newPosition = data.position * DISPLACE_POS_SCALE +
                     data.pattern * 8.0 * 2.0 * DISPLACE_SCALE;
  newPosition = vec3(snoise(newPosition + vec3(0.5, 0.0, 0.0)),
                     snoise(newPosition + vec3(10.5, 0.0, 0.0)),
                     snoise(newPosition + vec3(20.5, 0.0, 0.0))) *
                    0.5 +
                0.5;

  newColor = newColor * 0.5 + 0.5;
  // newColor = newPosition;
  vec3 npos_c = newColor;
  float contrast = 4.0;
  newColor = mix(mix(uColor2, uColor3, gain(newColor.x, contrast)),
                 mix(uColor4, uColor5, gain(newColor.y, contrast)),
                 gain(pow(newColor.z, 1.0), contrast));

  // newColor = mix(newColor, refColor, 1.0);
  newColor += refColor;
  // newColor = vec3(1.0, 0.0, 0.0);

  // refracted = (vec3(fresnel));
  // vec3 rcolor = vec3(snoise(refracted + vec3(0.5, 3.0, 0.0)),
  //                    snoise(refracted + vec3(10.5, 3.0, 0.0)),
  //                    snoise(refracted + vec3(20.5, 3.0, 0.0))) *
  //                   0.5 +
  //               0.5;
  // newColor = mix(newColor, rcolor, gain(snoise(newPosition + vec3(10.5, 0.0,
  // 0.0))*0.5+0.5, 4.0)*0.9); newColor = refracted;

  vec3 vor = voronoi3d(data.position * 20.0);
  vec3 vpos = data.position * 20.0;
  float voridf = vor.z * 0.001;

  // newNorm = vor;

  float bump_scale = 0.5 + random(uSeed + 6.0) * 0.5;
  if (random(uSeed + 5.0) < 0.5) {
    bump_scale *= 40.0;
  }
  float bump_clip = random(uSeed + 7.0) < 0.2 ? 0.0 : 1.0;
  float bump_strength = random(uSeed + 8.0) * 0.5;
  bump_strength = gain(bump_strength, 3.0);

  vec3 norm = data.normal;
  vec3 nnp = data.position * bump_scale;

  // vec3 nnp = vec3(voridf*10.0, 0.0, 0.0);
  vec3 newNorm1 = vec3(snoise(nnp + vec3(0.5, 0.0, 0.0)),
                       snoise(nnp + vec3(10.5, 0.0, 0.0)),
                       snoise(nnp + vec3(20.5, 0.0, 0.0))) *
                  2.0;

  vec3 newNorm = vec3(snoise(nnp + newNorm1 + vec3(0.5, 0.0, 0.0)),
                      snoise(nnp + newNorm1 + vec3(10.5, 0.0, 0.0)),
                      snoise(nnp + newNorm1 + vec3(20.5, 0.0, 0.0)));

  // newNorm = normalize(newPosition * 2.0 - 1.0);
  // newNorm = normalize(newNorm)*pow(length(newNorm), 2.0);

  float alignment = dot(normalize(newNorm), normalize(norm));
  if (bump_clip > 0.0) {
    newNorm *= float(alignment < 0.0);
  }
  //   newNorm *= float(alignment > 0.0 ? 1.0:-1.0);
  //   if (alignment < 0.0) {
  //     newNorm = -newNorm;
  //   }

  norm = normalize(norm - newNorm * bump_strength);

  // newColor = vec3(0.01, 0.01, 0.01);
  // float ng = 4.0;
  // newNorm = newNorm*0.5+0.5;
  // newNorm = vec3(
  //   gain(newNorm.x, ng),
  //   gain(newNorm.y, ng),
  //   gain(newNorm.z, ng)
  // )*2.0-1.0;
  // newNorm = normalize(newNorm)*iridescence;

  // norm = normalize(norm + newNorm*0.2);
  // norm = newNorm;
  // newColor = newPosition;

  // roughness = 1.0;
  // emission = 0.0;
  // iridescence = 0.0;
  // metallic = 0.0;

  vec4 color = vec4(newColor, 1.0);
#if IS_WIRES
  float wa =
      snoise(data.position * 0.5 + vec3(uSeed, 0.0, animation * 10.0)) * 0.5 +
      0.5;
  // wa = gain(wa, 1.0);
  color = vec4(uColor5, wa * 0.0);
  // csm_FragColor = color;
  // csm_Transmission = color.a;
#else
#endif

  return CoatOutput(color, norm, 1., roughness, emission, iridescence,
                    metallic);
}
