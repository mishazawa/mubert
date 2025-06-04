uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;
varying vec3 vPosition;
varying float vDisplacement;

#define FREQ 5.0

//#include<math>
//#include<snoise>
//#include<noise3>

float strips(float position) {
  return fit(smoothMod(position, 1.0, 1.5), 0.35, 0.6, 0.0, 1.0);
}

void main() {

  vec2 uv = vUv;
  vec3 pos = vPosition;
  float disp= vDisplacement;
  vec3 newColor = vec3(disp);
  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}