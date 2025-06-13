varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

//#include<common_uniforms>

#define SPEED .5
#define FREQ 1.
#define RANDOM_HIGHER_RANGE 0
//#include<snoise>
//#include<noise3>
//#include<random>
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

  //#include<common_standard_props>
  //csm_Roughness = mix(uRoughness, 0., line);

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}