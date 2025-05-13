precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying vec2 v_uv;

// Trail structure
struct Trail {
    vec2 position;
    float age;
    float size;
};

#define MAX_TRAIL 50
Trail trails[MAX_TRAIL];

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 pixelate(vec2 uv, float pixelSize) {
    return floor(uv * pixelSize) / pixelSize;
}

float drawTrail(vec2 uv, Trail trail) {
    float dist = length(uv - trail.position);
    float size = trail.size * (1.0 - trail.age * 0.5);
    float alpha = smoothstep(size, size * 0.8, dist) * (1.0 - trail.age);
    return alpha;
}

void main() {
    // Correct aspect ratio
    vec2 uv = v_uv;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    uv = uv * aspect;
    
    // Initialize trails
    for (int i = 0; i < MAX_TRAIL; i++) {
        float idx = float(i);
        float timeOffset = mod(u_time * 0.1 + idx * 0.3, 1.0);
        
        // Create a trail that follows mouse with some delay
        float delay = idx / float(MAX_TRAIL);
        vec2 mousePos = u_mouse * aspect;
        
        trails[i].position = mousePos;
        trails[i].age = mod(u_time * 0.005 + delay, 1.0);
        trails[i].size = 0.05 + 0.03 * sin(u_time * 0.1 + idx);
    }
    
    // Pixelate the UV coordinates
    float pixelSize = 30.0 + 10.0 * sin(u_time * 0.05);
    vec2 pixelUV = pixelate(uv, pixelSize);
    
    // Draw all trails
    float trailMask = 0.0;
    for (int i = 0; i < MAX_TRAIL; i++) {
        trailMask += drawTrail(pixelUV, trails[i]);
    }
    trailMask = clamp(trailMask, 0.0, 1.0);
    
    // Add some smooth, slower noise to the pixels (using sin for smoother variation)
    float noise = 0.5 + 0.5 * sin(u_time * 0.1 + pixelUV.x * 10.0) * cos(u_time * 0.05 + pixelUV.y * 10.0);
    
    // Mouse proximity effect
    float mouseDist = length(uv - u_mouse * aspect);
    float mouseEffect = smoothstep(0.3, 0.0, mouseDist);
    
    // Create grayscale value
    float gray = mix(noise / 0.01, noise, trailMask);
    
    // Add some variation based on pixel position
    gray = mix(gray, step(0.5, noise), trailMask * 0.8);
    
    // Calculate the trail's color. This will be the RGB for the fragment.
    // The 'gray' variable incorporates the trail's intensity.
    vec3 trailDisplayColor = vec3(1.0) * gray; // Base for white/gray trail
    
    // Add subtle animation to the trail pixels
    trailDisplayColor += 0.05 * sin(pixelUV.x * 0.01 + u_time * 0.0005) * sin(pixelUV.y * 1.0 + u_time * 0.005);
    
    // Set the final fragment color:
    // - RGB is the trail's calculated color (trailDisplayColor).
    // - Alpha is the trailMask itself.
    // This makes areas with no trail (trailMask = 0) fully transparent,
    // allowing the HTML background (#0D0D0D) and text to show through.
    gl_FragColor = vec4(trailDisplayColor, trailMask);
    
    #include <colorspace_fragment>
}





