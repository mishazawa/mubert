uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vDispPosition;
varying float vDisplacement;

#define FREQ 1.0
#define SPEED 0.1

//#include<math>
//#include<snoise>
//#include<noise3>
//#include<calc_bump>

void main() {
  vec3 noiseVal = noise3(vec4(SPEED * uTime + vPosition * vec3(.5, 50., .5) * FREQ, 1.0)) * 3.2;
  noiseVal += noise3(vec4(-vPosition + uTime * SPEED * 2.0, 1.0)) * 15.;
  float mask = smoothstep(.5, .51 , noiseVal.x);
  vec3 newColor = mix(uColor1, uColor2, mask);


  vec3 N = vNormal;
  csm_Bump = perturbNormalArb(
    -vViewPosition,
    N,
    vec2(dFdx(vDisplacement), dFdy(vDisplacement)), 
    smoothstep(0., 1., dot(N, normalize(vViewPosition))));

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}