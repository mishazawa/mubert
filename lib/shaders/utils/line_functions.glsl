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