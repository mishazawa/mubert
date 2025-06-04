uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vec2 uv = vUv;

  vec3 newColor = vec3(step(.5, fract(uv.y * 10.0)));
  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}