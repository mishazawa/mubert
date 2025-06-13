varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>

#define SPEED .5
#define FREQ 1.
#define FRAC_SCALE 8.


//#include<noise3>
//#include<voronoi3>
//#include<calc_bump>
//#include<line_functions>



void main() {
  vec3 key = vec3(uColorKeyValue);

  vec3 background = mix(uColor1, key,  uUseColorKey);
  vec3 newColor = background;

  vec3 pos = normalize(vPosition);

  newColor = maybeDrawLines(background, pos);

  float animation = uTime * SPEED;
  vec3 noiseSeed = uNoiseOffset + pos;

  vec3 noiseVal = mix(voronoi3d(noiseSeed), noise3(noiseSeed, animation), uNoiseVariant);

  float displacedY = pos.y + noiseVal.y * uColorNoiseScale + animation;
  
  float pattern = fract(displacedY);

  pattern = step(.5, pattern);

  newColor = mix(background, newColor, pattern);

  //#include<common_standard_props>
  csm_Roughness = mix(uRoughness, 1. - uRoughness, pattern * uRoughnessPattern);

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}