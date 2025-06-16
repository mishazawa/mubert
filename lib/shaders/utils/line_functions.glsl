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


  if (uLineCount > 0) {
    vec3 current = uColor2;
    vec3 plane = normalize(vec3(
    sin(current.x + timeFreq),
      cos(current.y + timeFreq),
      sin(current.z - timeFreq)
    ) + current);

    vec3 noiseVal = noise3(plane + pos + noiseOffset, timeSpeed);
    float line = lineFn(pos, plane + noiseVal, uLineWidth);
    newColor = mix(newColor, current, line);
  }

  if (uLineCount > 1) {
    vec3 current = uColor3;
    vec3 plane = normalize(vec3(
    sin(current.x + timeFreq),
      cos(current.y + timeFreq),
      sin(current.z - timeFreq)
    ) + current);

    vec3 noiseVal = noise3(plane + pos + noiseOffset, timeSpeed);


    float line = lineFn(pos, plane + noiseVal, uLineWidth);
    newColor = mix(newColor, current, line);
  }

    if (uLineCount > 2) {
    vec3 current = uColor4;
    vec3 plane = normalize(vec3(
    sin(current.x + timeFreq),
      cos(current.y + timeFreq),
      sin(current.z - timeFreq)
    ) + current);

    vec3 noiseVal = noise3(plane + pos + noiseOffset, timeSpeed);


    float line = lineFn(pos, plane + noiseVal, uLineWidth);
    newColor = mix(newColor, current, line);
  }

    if (uLineCount > 3) {
    vec3 current = uColor5;
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






vec3 maybeDrawLines2(in vec3 background, in vec3 pos, float time) {
  if (uLineCount == 0) return background;
  float timeFreq = uTime * FREQ;
  float timeSpeed = uTime * SPEED;
  vec3 noiseOffset = uNoiseOffset + uColorNoiseScale * vec3(uColorNoiseScale, 0., 0.);

  vec3 newColor = background;

  float pattern = 0.0;
  vec3 pcol = uColor1;

  vec3 pnoise = sinnoise_distort(pos, 1.0, 0.35, vec3(time, 0.0, 0.0));
  pos = pnoise;

  for (int i = 0; i < uLineCount; i++) {
    float pt = float(i)/float(uLineCount);
    float rv = random(pt+uSeed);

    vec3 col;
    if (i==0) { col = uColor2; }
    if (i==1) { col = uColor3; }
    if (i==2) { col = uColor4; }
    if (i==3) { col = uColor5; }
    
    vec3 npos = pos;
    npos.yz = rotate2d(npos.yz, rv);
    npos.xy = rotate2d(npos.xy, rv);


    float nval = npos.y*(0.5+rv*3.0) + time*3.0 + pt;
    float noise = vnoise1d(nval*2.0+rv*100.0)*2.0-1.0;
    // noise = sin(nval);
    pattern += noise;
    pcol = mix(pcol, col, smoothstep(0.2, 0.8, noise*0.5+0.5));
  }

  // pattern = pattern/float(uLineCount);
  pattern = pattern*0.5+0.5;
  float spread = 1.0;
  newColor = vec3(smoothstep(-spread, spread, pattern));
  newColor = pcol;
  // newColor = mix(background, newColor, pattern);
    



  // if (uLineCount > 0) {
  //   vec3 current = uColor2;
  //   vec3 plane = normalize(vec3(
  //   sin(current.x + timeFreq),
  //     cos(current.y + timeFreq),
  //     sin(current.z - timeFreq)
  //   ) + current);

  //   vec3 noiseVal = noise3(plane + pos + noiseOffset, timeSpeed);
  //   float line = lineFn(pos, plane + noiseVal, uLineWidth);
  //   newColor = mix(newColor, current, line);
  // }

  // if (uLineCount > 1) {
  //   vec3 current = uColor3;
  //   vec3 plane = normalize(vec3(
  //   sin(current.x + timeFreq),
  //     cos(current.y + timeFreq),
  //     sin(current.z - timeFreq)
  //   ) + current);

  //   vec3 noiseVal = noise3(plane + pos + noiseOffset, timeSpeed);


  //   float line = lineFn(pos, plane + noiseVal, uLineWidth);
  //   newColor = mix(newColor, current, line);
  // }

  //   if (uLineCount > 2) {
  //   vec3 current = uColor4;
  //   vec3 plane = normalize(vec3(
  //   sin(current.x + timeFreq),
  //     cos(current.y + timeFreq),
  //     sin(current.z - timeFreq)
  //   ) + current);

  //   vec3 noiseVal = noise3(plane + pos + noiseOffset, timeSpeed);


  //   float line = lineFn(pos, plane + noiseVal, uLineWidth);
  //   newColor = mix(newColor, current, line);
  // }

  //   if (uLineCount > 3) {
  //   vec3 current = uColor5;
  //   vec3 plane = normalize(vec3(
  //   sin(current.x + timeFreq),
  //     cos(current.y + timeFreq),
  //     sin(current.z - timeFreq)
  //   ) + current);

  //   vec3 noiseVal = noise3(plane + pos + noiseOffset, timeSpeed);


  //   float line = lineFn(pos, plane + noiseVal, uLineWidth);
  //   newColor = mix(newColor, current, line);
  // }

  return newColor;
}