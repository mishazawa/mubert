uniform float time;
uniform vec3 color1;
uniform vec3 color2;
varying vec2 vUv;
#define DIST_AMP .25
#define FREQ 2.0
#define SPEED 2.

//#include<pnoise>

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
  float mask = smoothstep(.5, .51 , noise(SPEED * time + vUv * 10.0));
  vec3 newColor = mix(color1, color2, mask);

  csm_DiffuseColor.rgba = vec4(newColor, 1.0);
}