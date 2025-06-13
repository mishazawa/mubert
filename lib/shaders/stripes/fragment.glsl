varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>

#define SPEED .5
#define FREQ 1.
#define FRAC_SCALE 8.


//#include<noise3>
//#include<calc_bump>
//#include<line_functions>



void main() {
  vec3 colors[5] = vec3[5](
    uColor1,
    uColor2,
    uColor3,
    uColor4,
    uColor5
  );

  vec3 key = vec3(uColorKeyValue);

  vec3 background = mix(uColor1, key,  uUseColorKey);
  vec3 newColor = background;


  vec3 pos = normalize(vPosition);

  newColor = maybeDrawLines(background, pos);

  //vec3 noiseVal = noise3(vec4(uNoiseOffset + (pos + uColorNoiseScale * vec3(uColorNoiseScale, 0., 0.)) + uTime * SPEED, 1.0));

  //float pattern = fract((noiseVal + pos * uNoiseOffset * FRAC_SCALE * float(uLineCount)).y + uTime);

  //pattern = smoothstep(.499, .501, pattern);

  //newColor = mix(background, newColor, pattern);

  //#include<common_standard_props>
  //csm_Roughness = mix(uRoughness, 0., pattern);

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}