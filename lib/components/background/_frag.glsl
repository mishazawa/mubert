uniform float uTime;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform sampler2D uCustomTex;

uniform vec2 uResolution;
varying vec2 vUv;
uniform bool uUseTex;

void main() {
  vec2 uv = vUv*2.0-1.0;
  if (uResolution.x > uResolution.y) {
    uv.y *= uResolution.y / uResolution.x;
  } else {
    uv.x *= uResolution.x / uResolution.y;
  }
  uv *= 0.5;
  // if (uUseTex) {
  //   uv *= 1.5;
  // }


  // uv.x *= 0.2;
  // uv.y = pow(uv.y, 0.5);

  float radial = length(uv);
  radial = pow(radial * 1.0, 1.0) * 1.0;
  vec3 a = mix(uColor4, uColor3*0.5, radial);

  // vec3 b = mix(uColor1, uColor2, radial);

  // vec3 newColor = mix(a, b, pow(uv.y, 0.7) * 0.2);

  vec3 texColor1 = texture(uCustomTex, vec2(0.0, 0.0)).xyz;
  vec3 texColor2 = texture(uCustomTex, vec2(0.1, 0.1)).xyz;
  vec3 texColor = mix(texColor1, pow(texColor2*0.25, vec3(2.0)), radial);

  vec3 newColor = a;
  if (uUseTex) {
    newColor = texColor;
  }
  // newColor = vec3(radial);
  // newColor = pow(newColor*0.25, vec3(1.5)); 
  gl_FragColor = vec4(newColor.rgb, 1.0);
}