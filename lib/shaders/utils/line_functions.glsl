float plot(float d, float width){
  const float THICKNESS = .01;
  return  smoothstep( THICKNESS - width, THICKNESS, d) -
          smoothstep( THICKNESS, THICKNESS + width, d);
}

// p: 3D point on unit sphere
// n: normal vector of the plane (orientation)
float lineFn(vec3 p, vec3 n, float width) {
    float d = (dot(p, n));
    return plot(d, width);
} 


vec3 maybeDrawLines(in vec3 background, in vec3 pos) {
  if (uLineCount == 0) return background;
  float timeFreq = uTime * FREQ;
  float timeSpeed = uTime * SPEED;
  vec3 noiseOffset = uNoiseOffset + uColorNoiseScale * vec3(uColorNoiseScale, 0., 0.);

  vec3 newColor = background;

  for (int i = 0; i < uLineCount; i++) {
    vec3 current;
    if (i==0) { current = uColor2; }
    if (i==1) { current = uColor3; }
    if (i==2) { current = uColor4; }
    if (i==3) { current = uColor5; }

    vec3 plane = normalize(vec3(
      sin(current.x + timeFreq),
      cos(current.y + timeFreq),
      sin(current.z - timeFreq)
    ) + current);
    
    vec3 noiseVal = noise3(plane + pos + noiseOffset, timeSpeed);
    float line = lineFn(pos, plane + noiseVal, uLineWidth);
    newColor = mix(newColor, current, line);
  }
  return newColor;
}



vec3 getColorIdx(int idx) {
  idx = idx % 5;
  if (idx == 0) return uColor1;
  if (idx == 1) return uColor2;
  if (idx == 2) return uColor3;
  if (idx == 3) return uColor4;
  if (idx == 4) return uColor5;
  return vec3(0.0);
}

float gain( float x, float k ) 
{
    float a = 0.5*pow(2.0*((x<0.5)?x:1.0-x), k);
    return (x<0.5)?a:1.0-a;
}

vec3 drawAudioLines(in vec3 background, in vec3 pos, float time) {
  int lineCount = max(uLineCount, 1);
  float timeFreq = uTime * FREQ;
  float timeSpeed = uTime * SPEED;
  vec3 noiseOffset = uNoiseOffset + uColorNoiseScale * vec3(uColorNoiseScale, 0., 0.);

  vec3 newColor = getColorIdx(0);

  float pattern = 0.0;

  pos = sinnoise_distort(pos, 0.9, 0.3*random(uSeed+10.2), vec3(time*0.5, 0.0, 0.0));

  int nc = 5;
  int nl = 4+int(random(uSeed+10.2)*4.0);

  vec3 npos_accum = vec3(0.0);

  for (int i = 0; i < nl; i++) {


    float pt = float(i) / float(nl);
    float rnd1 = random(pt + uSeed + 0.5);
    float rnd2 = random(pt + uSeed + 10.5);
    float rnd3 = random(pt + uSeed + 20.5);
    float rnd4 = random(pt + uSeed + 30.5);
    float rnd5 = random(pt + uSeed + 40.5);



    vec3 npos = (pos*0.3);
    float rot_speed = 2.0;
    vec3 npos_vec = vec3(0.0, 1.0, 0.0);
    npos.xy = rotate2d(npos.xy, uTime*rnd1*rot_speed);
    npos.yz = rotate2d(npos.yz, uTime*rnd2*rot_speed);
    npos.xz = rotate2d(npos.xz, uTime*rnd3*rot_speed);
    npos_vec.xy = rotate2d(npos_vec.xy, uTime*rnd1*rot_speed);
    npos_vec.yz = rotate2d(npos_vec.yz, uTime*rnd2*rot_speed);
    npos_vec.xz = rotate2d(npos_vec.xz, uTime*rnd3*rot_speed);

    float scale = 0.5;
    float speeds = 1.0;
    npos.x *= (0.2+rnd4*0.8);
    vec2 puv = vec2(
      npos.x * 0.5 + 0.5,
      npos.y * 0.5 + 0.5
    );
    puv.y *= pow(0.2+rnd4*0.8, 2.0)*speeds;

    vec2 auv = puv;
    auv = vec2(
      clamp(mix(0.0, 0.4, auv.x), 0.0, 1.0),
      clamp(mix(0.0, 1.0, auv.y), 0.0, 1.0)
    );
    float audio = texture(uAudioTex, auv).r;
    // audio = gain(pow(audio, 1.0), 8.0);
    audio = gain(pow(audio, 1.0), VERTEX==1?2.0:2.0);





    vec3 col1 = getColorIdx(i+1);
    float matte = audio;


    vec3 col = mix(newColor, col1, matte);
    newColor = col;
    pattern += audio*2.0-1.0;
    npos_accum += npos_vec * audio * 0.5;

  }


  float pscale = 0.05 + random(uSeed + 100.0) * 0.1;
  npos_accum *= pscale;
  vec3 new = vec3(
    snoise(npos_accum + vec3(0.5, 0.0, 0.0)),
    snoise(npos_accum + vec3(10.5, 0.0, 0.0)),
    snoise(npos_accum + vec3(20.5, 0.0, 0.0))
  );

  return vec3(npos_accum);
}




vec3 drawSinLines(in vec3 background, in vec3 pos, float time) {
  int lineCount = max(uLineCount, 1);
  float timeFreq = uTime * FREQ;
  float timeSpeed = uTime * SPEED;
  vec3 noiseOffset = uNoiseOffset + uColorNoiseScale * vec3(uColorNoiseScale, 0., 0.);

  vec3 newColor = background;

  float pattern = 0.0;

  pos = sinnoise_distort(pos + noiseOffset, 1.0, 0.35, vec3(time, 0.0, 0.0));

  for (int i = 0; i < lineCount; i++) {
    float pt = float(i) / float(lineCount);
    float rv = random(pt + uSeed);

    vec3 col;
    if (i==0) { col = uColor2; }
    if (i==1) { col = uColor3; }
    if (i==2) { col = uColor4; }
    if (i==3) { col = uColor5; }
    
    vec3 npos = pos;
    npos.yz = rotate2d(npos.yz, rv);
    npos.xy = rotate2d(npos.xy, rv);


    float nval = npos.y * (0.5 + rv * 3.0) + time * 3.0 + pt;
    float noise = vnoise1d(nval * 2.0 + rv * 100.0) * 2.0 - 1.0;
    pattern += noise;
    newColor = mix(newColor, col, smoothstep(0., 1.1 + uLineWidth, noise*0.5+0.5));
  }

  return newColor;
}

vec3 generateSyncedPosition (in vec3 vPosition) {
  return stoc(ctos(vPosition)) * fit(uDisplacementNoiseScale, 0.01, 2.0, 1., 4.);
}