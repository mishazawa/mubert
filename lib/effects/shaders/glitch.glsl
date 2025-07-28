uniform float uTime;
uniform float uRMS;
uniform sampler2D uAudioTex;

void mainImage(const in vec4 inputColor, const in vec2 uv,
               out vec4 outputColor) {
  outputColor = inputColor; // * texture2D(uAudioTex, uv);
}
