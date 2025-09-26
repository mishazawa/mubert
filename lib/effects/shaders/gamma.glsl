
vec3 sRGBTransferEOTF(vec3 color) {
  vec3 a = pow(color * 0.9478672986 + 0.0521327014, vec3(2.4));
  vec3 b = color * 0.0773993808;
  return mix(a, b, step(color, vec3(0.04045)));
}

vec3 sRGBTransferOETF(vec3 color) {
  vec3 a = pow(color, vec3(0.41666)) * 1.055 - 0.055;
  vec3 b = color * 12.92;
  return mix(a, b, step(color, vec3(0.0031308)));
}

void mainImage(const in vec4 inputColor, const in vec2 uv,
               out vec4 outputColor) {

  vec3 gamma = sRGBTransferOETF(inputColor.rgb);
  outputColor = vec4(gamma, inputColor.a);
}
