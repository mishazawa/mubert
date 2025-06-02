uniform vec3 color;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float time;

#pragma glslify: snoise = require(./utils/simplex4d.glsl)
#pragma glslify: noise_3 = require(./utils/simplex3d.glsl, snoise=snoise)
#pragma glslify: pattern = require(./utils/pattern.glsl, snoise=snoise)
#pragma glslify: gain = require(./utils/gain.glsl)

void main() {

  vec3 pos = vPosition;

  float noise = pattern(pos, time);
  noise = noise*0.5+0.5;
  // noise = pow(noise, 2.0);
  noise = 1.0-noise;
  noise = gain(noise, 16.0);

  vec3 colorA = noise_3(vec4(pos*0.1+vNormal*0.2, 33.0+time*0.2))*0.5+0.5;
  vec3 colorB = noise_3(vec4(pos*0.1+vNormal*0.2, 666.0+time*0.2))*0.5+0.5;

  // colorA = pow(colorA, vec3(2.0));
  // colorB = pow(colorB, vec3(1.0/2.0));

  vec3 color = mix(colorA, colorB, noise);
  
  gl_FragColor.rgba = vec4(color, 1.0);
}