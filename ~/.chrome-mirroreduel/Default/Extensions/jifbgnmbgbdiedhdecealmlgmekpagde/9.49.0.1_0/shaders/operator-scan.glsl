uniform shader iChunk;
uniform float4 iVisibleRect;
uniform float iTick;
uniform float iScale;


const float DEBUG_UNDERLAY_ENABLE = 0.0;
const float DEBUG_UNDERLAY_ALPHA = 0.38;
const float GLOBAL_DARKEN = 0.1;

// Edge vignette controls.
const float VIGNETTE_ENABLE = 1.0;
const float VIGNETTE_STRENGTH = 0.1;
const float VIGNETTE_INNER = 0.72;
const float VIGNETTE_OUTER = 1.22;
const float VIGNETTE_POWER = 1.35;
const half3 VIGNETTE_COLOR = half3(0.0, 0.0, 0.0);

// Vertical height of the scan effect band in normalized UV space.
const float EFFECT_BAND_HEIGHT = 0.28;
const float EFFECT_CORE_HEIGHT = 0.15;

// Glitch box size controls (scale-normalized pixels).
const float2 GLITCH_CELL_SIZE = float2(2.2, 2.2);
const float2 GLITCH_SCROLL_DIRECTION = float2(0.0, 1.0);
const float GLITCH_SCROLL_SPEED = 1.0;
const float2 GLITCH_BOX_HALF_SIZE = float2(0.28, 0.20);
const float GLITCH_BOX_CORNER = 0.12;
const float GLITCH_BOX_EDGE_SOFTNESS = 0.05;

// Chromatic shift controls.
const float CA_ENABLE = 1.0;
const float CA_BLEND_STRENGTH = 1.0;
const float CA_SHIFT_STRENGTH = 1.0;
const float CA_MAX_SHIFT = 0.010;
const float CA_CENTER_POWER = 5.0;
const float CA_RIPPLE_START = 0.0;
const float CA_RIPPLE_END = 0.4;
const float2 CA_DIRECTION = float2(1.0, 0.0);
const float CA_RED_WEIGHT = 0.2;
const float CA_BLUE_WEIGHT = 0.6;

float hash12(float2 p) {
    p = fract(p * float2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

half4 sampleSource(float2 globalXY) {
    float2 mn = iVisibleRect.xy + 0.5;
    float2 mx = iVisibleRect.xy + iVisibleRect.zw - 0.5;
    return iChunk.eval(clamp(globalXY, mn, mx));
}

half4 main(float2 xy) {
    float2 localXY = xy - iVisibleRect.xy;
    float2 size = max(iVisibleRect.zw, float2(1.0));
    float scale = max(iScale, 1.0);
    float2 localScaled = localXY / scale;
    float2 uv = localXY / size;
    float t = iTick * 1.2;

    float scanSpeed = 1.2;
    float phase = t * scanSpeed;
    float baseY = 0.5 + sin(phase) * 0.35;
    float velocity = cos(phase);
    float bend = cos((uv.x - 0.5) * 3.14159) * 0.1 * velocity;
    float scanLineY = baseY + bend;

    float distToLine = abs(uv.y - scanLineY);
    // Master falloff: strongest at the middle wave, smoothly fades toward top/bottom.
    float bandMask = 1.0 - smoothstep(0.0, EFFECT_BAND_HEIGHT, distToLine);
    float bandFade = bandMask * bandMask;
    float glowMask = exp(-distToLine * 15.0) * bandFade;

    float rippleMask = (1.0 - smoothstep(0.0, EFFECT_CORE_HEIGHT, distToLine)) * bandFade;

    // Smaller GLITCH_CELL_SIZE => smaller boxes. Larger => bigger boxes.
    float2 gridUv = localScaled / max(GLITCH_CELL_SIZE, float2(0.001));
    float2 glitchScrollDir = GLITCH_SCROLL_DIRECTION / max(length(GLITCH_SCROLL_DIRECTION), 1e-4);
    gridUv += glitchScrollDir * (t * GLITCH_SCROLL_SPEED);
    float2 gridCell = floor(gridUv);
    float2 cellUv = fract(gridUv) - 0.5;

    // Rounded rectangle mask inside each grid cell.
    float2 halfSize = GLITCH_BOX_HALF_SIZE;
    float corner = GLITCH_BOX_CORNER;
    float2 q = abs(cellUv) - halfSize + corner;
    float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - corner;
    float roundedBoxMask = 1.0 - smoothstep(0.0, GLITCH_BOX_EDGE_SOFTNESS, sd);

    float matrixLook = step(0.95, hash12(gridCell)) * rippleMask * roundedBoxMask;

    float2 distortUV = float2(matrixLook * 0.02, 0.0);
    float2 sampleXY = (uv + distortUV) * size + iVisibleRect.xy;
    half4 src = sampleSource(sampleXY);
    half3 color = src.rgb;

    if (src.a < 1e-4) {
        color = half3(0.02, 0.02, 0.04);
    }

    // Darken the whole frame so scan/glitch layers read stronger.
    color *= half(1.0 - clamp(GLOBAL_DARKEN, 0.0, 1.0));

    // Debug underlay: translucent black under the affected scan band.
    float underlayAlpha = DEBUG_UNDERLAY_ENABLE * DEBUG_UNDERLAY_ALPHA * bandFade;
    color *= half(1.0 - underlayAlpha);

    // Keep a soft wave-shaped highlight but no hard center line.
    color += src.rgb * half(glowMask * 0.16);

    // Build block color from source color first, then add subtle randomized variation.
    float timeSlice = floor(t * 20.0);
    float jx = hash12(gridCell + float2(timeSlice + 13.0, 17.0));
    float jy = hash12(gridCell + float2(19.0, timeSlice + 23.0));
    float2 jitterScaled = (float2(jx, jy) - 0.5) * float2(22.0, 8.0);
    float2 jitterPx = jitterScaled * scale;
    half3 neighborBase = sampleSource(xy + jitterPx).rgb;
    half3 blockBase = mix(src.rgb, neighborBase, half(0.28));

    float rx = hash12(gridCell + float2(timeSlice + 1.0, 5.3));
    float ry = hash12(gridCell + float2(7.9, timeSlice + 2.0));
    float rz = hash12(gridCell + float2(timeSlice + 3.0, 11.7));
    float rn = hash12(gridCell + float2(timeSlice + 41.0, 3.0));
    half3 variationMul = half3(
        0.92 + 0.16 * rx,
        0.92 + 0.16 * ry,
        0.92 + 0.16 * rz
    );
    half3 variationAdd = half3(
        (rx - 0.5) * 0.06,
        (ry - 0.5) * 0.06,
        (rz - 0.5) * 0.06
    );
    half lumaJitter = half((rn - 0.5) * 0.10);
    half3 glitchColor = clamp(blockBase * variationMul + variationAdd + half3(lumaJitter), 0.0, 1.0);
    float glitchAmp = matrixLook * (0.9 + 0.7 * hash12(gridCell + float2(timeSlice + 29.0, 31.0)));
    color += glitchColor * half(glitchAmp);

    float centerWeight = pow(clamp(bandFade, 0.0, 1.0), CA_CENTER_POWER);
    float caBase = smoothstep(CA_RIPPLE_START, CA_RIPPLE_END, rippleMask) * centerWeight * CA_ENABLE;
    float caMix = clamp(caBase * CA_BLEND_STRENGTH, 0.0, 1.0);
    float caShift = CA_MAX_SHIFT * CA_SHIFT_STRENGTH * caBase;
    float2 caDir = CA_DIRECTION / max(length(CA_DIRECTION), 1e-4);
    half4 rSample = sampleSource((uv + distortUV + caDir * caShift) * size + iVisibleRect.xy);
    half4 bSample = sampleSource((uv + distortUV - caDir * caShift) * size + iVisibleRect.xy);
    half2 shiftedRB = half2(
        mix(color.r, rSample.r, half(CA_RED_WEIGHT)),
        mix(color.b, bSample.b, half(CA_BLUE_WEIGHT))
    );
    color.rb = mix(color.rb, shiftedRB, half(caMix));

    color *= half(0.95 + 0.05 * sin(localScaled.y * 2.0));

    float2 vignetteUV = uv * 2.0 - 1.0;
    vignetteUV.x *= size.x / max(size.y, 1.0);
    float vignetteEdge = smoothstep(VIGNETTE_INNER, VIGNETTE_OUTER, length(vignetteUV));
    float vignetteMask = pow(clamp(vignetteEdge, 0.0, 1.0), VIGNETTE_POWER) * VIGNETTE_ENABLE;
    float vignetteMix = clamp(vignetteMask * VIGNETTE_STRENGTH, 0.0, 1.0);
    color = mix(color, VIGNETTE_COLOR, half(vignetteMix));

    return half4(clamp(color, 0.0, 1.0), src.a);
}
