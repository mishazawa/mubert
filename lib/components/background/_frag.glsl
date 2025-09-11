uniform float uTime;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform sampler2D uCustomTex;

uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  // uv.x *= 0.2;
  // uv.y = pow(uv.y, 0.5);

  float radial = length(uv - 0.5) * 0.25;
  radial = pow(radial * 2.0, 1.0) * 1.0;
  vec3 a = mix(uColor3, uColor4, radial);
  vec3 b = mix(uColor1, uColor2, radial);

  vec3 newColor = mix(a, b, pow(uv.y, 0.7) * 0.2);
  newColor = pow(newColor*0.25, vec3(1.5));
  gl_FragColor = vec4(newColor.rgb, 1.0);
}