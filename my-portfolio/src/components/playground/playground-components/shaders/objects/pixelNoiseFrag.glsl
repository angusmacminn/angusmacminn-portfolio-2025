uniform float uTime;
uniform float uNoiseScale1;
uniform float uPixelation1;
uniform float uBlendFactor1;
uniform vec2 uMouse;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uRadius;


varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vNoise;

#include ../includes/simplexNoise4d.glsl




void main() {    
    float time = uTime * 0.1;
    vec3 normal = vNormal;
    vec2 uv = vUv;

    vec3 color1 = vec3(0.7, 0.1, 0.6);
    vec3 color2 = vec3(0.1, 0.4, 0.8);
    vec3 color3 = vec3(0.7, 0.2, 0.6);
    vec3 color4 = vec3(0.6, 0.3, 0.7);


    //background noise
    float noiseValue = simplexNoise4d(vec4(uv * 1.9, time, sin(time)));
    noiseValue *= 2.0;
    vec3 baseColor = mix(color1, color2, noiseValue);

    //pixel noise
    vec3 quantizedPosition = floor(vPosition * uPixelation1) / uPixelation1;
    float pixelNoiseValue = simplexNoise4d(vec4(quantizedPosition * uNoiseScale1 + vec3(time * 4.0), 1.0));
    vec3 pixelNoiseColor = mix(color1, color2, pixelNoiseValue * 2.0 + 1.0);

    //distance from cursor
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    float distToCursor = distance(uv, mouseUv);

    //blending based on distance to cursor
    float blendFactor = smoothstep(uRadius * 0.3, uRadius, distToCursor);

    vec3 finalColor = mix(pixelNoiseColor, baseColor, blendFactor);
    //vec3 finalColor = pixelNoiseColor;

    
    gl_FragColor = vec4(finalColor, 1.0);
}
