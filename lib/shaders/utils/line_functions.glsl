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
  vec3 colors[5] = vec3[5](
    uColor1,
    uColor2,
    uColor3,
    uColor4,
    uColor5
  );

  vec3 newColor = background;

  for (int i = 1; i <= uLineCount; i++) { 
    vec3 lineColor = colors[i];
    vec3 plane = normalize(vec3(
      sin(lineColor.x + uTime * FREQ),
      cos(lineColor.y + uTime * FREQ), 
      sin(lineColor.z - uTime * FREQ)
    ) + colors[i]);


    vec3 noiseVal = noise3(vec4(uNoiseOffset + (pos + plane + uColorNoiseScale * vec3(uColorNoiseScale, 0., 0.)) + uTime * SPEED, 1.0));

    float line = lineFn(pos, plane + noiseVal, uLineWidth);

    newColor = mix(newColor, colors[i], line);
  }

  newColor = mix(background, newColor, clamp(float(uLineCount), 0., 1.));

  return newColor;
}