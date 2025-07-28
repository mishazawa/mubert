uniform float uTime;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;

uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec3 a = mix(uColor3, uColor4, uv.x);
  vec3 b = mix(uColor1, uColor2, 1. - uv.x);

  vec3 newColor = mix(a, b, uv.y);

  gl_FragColor = vec4(newColor, 1.0);
}