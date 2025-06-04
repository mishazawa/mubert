uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;
varying vec3 vPosition;

#define SPEED 1.
#define FREQ 1.

//#include<snoise>
//#include<noise3>

void main() {

  vec3 noiseVal = noise3(vec4(SPEED * uTime + vPosition * FREQ, 1.0)) * 3.2;
  float mask = smoothstep(.5, .51 , noiseVal.x);
  vec3 newColor = mix(uColor1, uColor2, mask);

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}