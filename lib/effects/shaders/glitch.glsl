uniform float uTime;
uniform float uRMS;
uniform sampler2D uAudioTex;


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
    amount *= 0.5+length(base.rgb)*0.5; // modulate by brightness
    amount = clamp(amount, 0.0, 1.0); // avoid excessive offset

    // Channel-specific offsets (R outwards, B inwards, G stays)
    vec2 offsR =  -dir * amount;
    vec2 offsG =  -dir * amount * 0.5;
    vec2 offsB =  vec2(0.0);

    // Sample input buffer with per-channel offsets
    float rCh = texture(inputBuffer, clamp(uv + offsR, 0.0, 1.0)).r;
    float gCh = texture(inputBuffer, clamp(uv + offsG, 0.0, 1.0)).g;
    float bCh = texture(inputBuffer, clamp(uv + offsB, 0.0, 1.0)).b;

    outputColor = vec4(rCh, gCh, bCh, base.a);

}