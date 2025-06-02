varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float time;

#pragma glslify: snoise = require(./utils/simplex4d.glsl)
#pragma glslify: pattern = require(./utils/pattern.glsl, snoise=snoise)
#pragma glslify: gain = require(./utils/gain.glsl)


void main() {
  vUv = uv;

  vec3 pos = position;

  float nscale = 0.5;

  vec3 noise3 = vec3(
    snoise(vec4(pos.x, pos.y, pos.z, time*0.2+10.0)*nscale),
    snoise(vec4(pos.x, pos.y, pos.z, time*0.2+20.0)*nscale),
    snoise(vec4(pos.x, pos.y, pos.z, time*0.2+30.0)*nscale)
  );
  
  vPosition = pos;


  float noise = pattern(pos, time);
  noise = noise * 0.5 + 0.5;
  noise = gain(noise, 3.0);
  pos = pos*(1.0+noise*0.3);
  pos = pos + noise3*1.0;

  vNormal =  normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}