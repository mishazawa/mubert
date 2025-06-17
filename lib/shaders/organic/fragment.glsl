varying vec2 vUv;
varying vec3 vPosition;

//#include<common_uniforms>


#define FREQ 1.0
#define SPEED 0.1

//#include<math>
//#include<snoise>
//#include<noise3>

void main() {
  vec3 noiseVal = noise3(uNoiseOffset + (-vPosition * uColorNoiseScale), uTime * SPEED * 2.0) * 15.;
  
  float mask = smoothstep(.0, 1. , noiseVal.x);

  mask = smoothstep(.5, .51 , mask);

  vec3 key = vec3(uColorKeyValue);

  vec3 color1 = mix(uColor1, key,  uUseColorKey);

  vec3 newColor = mix(color1, uColor2, mask);

  //#include<common_standard_props>

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}