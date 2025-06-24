varying vec2 vUv;
varying vec3 vPosition;


//#include<common_uniforms>

#define SPEED .5
#define FREQ 1.
#define FRAC_SCALE 16.

//#include<random>
//#include<math>
//#include<noise3>
//#include<voronoi3>

//#include<line_functions>



void main() {
  vec3 key = vec3(uColorKeyValue);

  vec3 background = mix(uColor1, key,  uUseColorKey);
  vec3 newColor = background;

  vec3 POS = normalize(vPosition);

  newColor = maybeDrawLines(background, POS);

  float animation = uTime * SPEED;
  vec3 noiseSeed = uNoiseOffset + POS;

  vec3 noiseVal = mix(voronoi3d(noiseSeed), noise3(noiseSeed, animation), uNoiseVariant);

  float noiseScale = mix(uStripesWidth + uColorNoiseScale, uColorNoiseScale, uNoiseVariant);

  float displacedY = POS.y + (noiseVal.y * noiseScale)  + animation;
  
  float pattern = fract(displacedY) + uStripesWidth - .5;

  pattern = step(.5, pattern);

  //newColor = mix(background, newColor, pattern);

  //#include<common_standard_props>
  csm_Roughness = mix(uRoughness, 1. - uRoughness, pattern * uRoughnessPattern);

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}