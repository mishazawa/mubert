uniform float uTime;
uniform float uRMS;
uniform sampler2D uAudioTex;


vec3 rgb2hsv(in vec3 rgb)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(rgb.bg, K.wz), vec4(rgb.gb, K.xy), step(rgb.b, rgb.g));
    vec4 q = mix(vec4(p.xyw, rgb.r), vec4(rgb.r, p.yzx), step(p.x, rgb.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;

    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb( in vec3 hsv )
{
    vec3 rgb = clamp( abs(mod(hsv.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	return hsv.z * mix( vec3(1.0), rgb, hsv.y);
}

void mainImage(const in vec4 inputColor, const in vec2 uv,
               out vec4 outputColor) {

    // Vector from screen center
    vec2 c = uv - 0.5;
    float r = length(c);

    // Direction (safe at center)
    vec2 dir = (r > 0.0) ? c / r : vec2(0.0);

    // Aberration grows smoothly from center -> edges
    // r^2 gives a lens-like falloff; edgeRamp keeps the very center pristine
    float edgeRamp = smoothstep(0.0, 1.5, pow(r, 0.5));
    float amount   = uRMS * 1.0 * r * edgeRamp; // tune 0.06 as desired
    vec4 base = texture(inputBuffer, uv);
    amount *= length(base.rgb)*0.25; // modulate by brightness
    amount = clamp(amount, 0.0, 1.0); // avoid excessive offset

    // Channel-specific offsets (R outwards, B inwards, G stays)
    vec2 offsR =  -dir * amount;
    vec2 offsG =  -dir * amount * 0.5;
    vec2 offsB =  vec2(0.0);

    // Sample input buffer with per-channel offsets
    float rCh = texture(inputBuffer, clamp(uv + offsR, 0.0, 1.0)).r;
    float gCh = texture(inputBuffer, clamp(uv + offsG, 0.0, 1.0)).g;
    float bCh = texture(inputBuffer, clamp(uv + offsB, 0.0, 1.0)).b;

    vec3 crgb = vec3(rCh, gCh, bCh);
    vec3 hsv = rgb2hsv(crgb);
    hsv.x += (0.0); // hue shift
    hsv.y += (0.2); // saturation boost
    hsv.z += (0.0); // value boost
    // hsv.z = pow(hsv.z, 0.8);
    hsv.y = clamp(hsv.y, 0.0, 1.0);
    crgb = hsv2rgb(hsv);


    vec3 a = crgb;
    float uExposure = 1.5; // e.g. 1.0 = neutral, lower = darker
    vec3 mapped = vec3(1.0) - exp(-a * uExposure);
    float gamma = 1.0;
    mapped = pow(mapped, vec3(1.0 / gamma));
    vec3 newColor = mapped;

    crgb = newColor;

    outputColor = vec4(crgb, base.a);
    // outputColor.rgb = smoothstep(0.0, 1.0, pow(outputColor.rgb, vec3(0.6))); // slight gamma

}