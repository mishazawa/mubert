#define DIST_AMP 5.
#define NOISE_DIST_AMP 1.
#define SPEED .1
#define FREQ 1.
#define FRAC_SCALE 16
#define DISPLACE_SCALE (0.75 + random(uSeed + 69.0) * 0.25)*10.0
#define DISPLACE_POS_SCALE 0.0
#define FLAT

//#include<math>
//#include<noise3>
//#include<random>
//#include<noise_distortion>
//#include<line_functions>

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


  // #if VERTEX == 0
  //   // draw round circle
  //   // P = vec3(gl_FragCoord.xy/1000.0, 0.0);
  //   P = vec3(0.0, 0.0, 0.0);
  // #else
  // #endif
  // // if (VERTEX == 0) {
  // //   P = vec3(gl_FragCoord.xy/1000.0, 0.0);
  // // }
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

  newPosition = P*DISPLACE_POS_SCALE + patt * 8.0 * DISPLACE_SCALE;
  newPosition = P +
                vec3(snoise(newPosition + vec3(0.5, 2.0, 0.0)),
                     snoise(newPosition + vec3(10.5, 2.0, 0.0)),
                     snoise(newPosition + vec3(20.5, 2.0, 0.0))) *
                    (0.3 +
                random(uSeed + 4.0) * 0.2);
  // return P;
  if (VERTEX==1) {
    newPosition = P;
  }
  return newPosition;
}

//#include<calc_normal>

DisplacePatternOutput displace_pattern(in DisplacePatternInput data,
                                       float animation) {
  Neighbours samples = getNeighbours(data.position, data.normal);

  vec3 P = data.position;
  // #if VERTEX==0
  //   // draw round circle
  //   vec2 uv = vec2(gl_FragCoord.x, gl_FragCoord.y)/1000.0;
  //   P = vec3(0.0, 0.0, 0.0);
  // #else
  // #endif
  vec3 patt = pattern_(P, animation);

  // vec3 p = data.position;
  // vec3 n = data.normal;


  vec3 p = displace_(P, vec3(0.0, 0.0, -1.0), patt, animation);
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

  vec3 P = data.position;
  // #if VERTEX==0
  //   // draw round circle
  //   vec2 uv = vec2(gl_FragCoord.x, gl_FragCoord.y)/100.0;
  //   P = vec3(uv, 0.0);
  // #else
  // #endif

  float roughness =
      snoise(data.pattern - 3.3 + vec3(0.0, 0.0, uSeed * 10.0)) * 0.5 + 0.5;
  roughness = gain(roughness, 3.0);
  float emission =
      snoise(data.pattern - 4.4 + vec3(0.0, 0.0, uSeed * 20.0)) * 0.5 + 0.5;
  emission = gain(emission, 4.0);
  float iridescence =
      snoise(data.pattern - 5.4 + vec3(0.0, 0.0, uSeed * 30.0)) * 0.5 + 0.5;
  iridescence = gain(pow(iridescence, 1.0), 2.0);

  vec3 viewDir = cameraPosition; // bug in firefox. no varying for camera pos.

  vec3 reflected = reflect(-viewDir, normalize(data.normal));
  float eta = 1.0 / 1.5; // air to glass
  vec3 refracted = refract(viewDir, normalize(data.normal), eta);

  vec3 newPosition = P * DISPLACE_POS_SCALE +
                     data.pattern * 8.0 * DISPLACE_SCALE;
  newPosition = vec3(snoise(newPosition + vec3(0.5, 0.0, 0.0)),
                     snoise(newPosition + vec3(10.5, 0.0, 0.0)),
                     snoise(newPosition + vec3(20.5, 0.0, 0.0))) *
                    0.5 +
                0.5;

  newColor = mix(mix(uColor1, uColor2, gain(newPosition.x, 8.0)),
                 mix(uColor3, uColor4, gain(newPosition.y, 8.0)),
                 gain(pow(newPosition.z, 2.0), 8.0));

  vec3 norm = data.normal;
  // vec3 nnp = vPosition*9.0 + newPosition*0.0;
  // vec3 newNorm = vec3(
  //   snoise(nnp + vec3(0.5, 0.0, 0.0)),
  //   snoise(nnp + vec3(10.5, 0.0, 0.0)),
  //   snoise(nnp + vec3(20.5, 0.0, 0.0))
  // );
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

  


  return CoatOutput(newColor, norm, 1., uRoughness, emission, iridescence);
}
