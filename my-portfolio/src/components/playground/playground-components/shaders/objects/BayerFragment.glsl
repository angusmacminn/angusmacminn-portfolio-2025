uniform float uTime;
uniform vec2 uResolution;

uniform float uPixelSize;
uniform float uCellPixelSizeMultiplier;
uniform float uUvMultiplier;
uniform float uWarp1Amplitude;
uniform float uWarp1Frequency;
uniform int uWarp1Octaves;
uniform float uWarp1Persistence;
uniform float uWarp1Lacunarity;
uniform float uWarp2Amplitude;
uniform float uWarp2Frequency;
uniform int uWarp2Octaves;
uniform float uWarp2Persistence;
uniform float uWarp2Lacunarity;
uniform vec3 uColor;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vPosition;

// inverse Lerp
float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

// remap
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

//HASH
vec3 hash( vec3 p ) 
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

//NOISE
float noise( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );

	vec3 u = f*f*(3.0-2.0*f);

  return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                        dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                        dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
              mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                        dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                        dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

//FBM
float fbm(vec3 p, int octaves, float persistence, float lacunarity){
  float amplitude = 0.5;
  float frequency = 0.7;
  float total = 0.0;
  float normalization = 0.0;

  for(int i = 0; i < octaves; ++i){
    float noiseValue = noise(p * frequency);
    total += noiseValue * amplitude;
    normalization += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  total /= normalization;

  return total;
}

// //DOMAIN WARPING
float domainWarpingFBM(vec3 coords, float amplitude, float frequency, int octaves, float persistence, float lacunarity){
    vec3 offset = vec3(
        fbm(coords * frequency, octaves, persistence, lacunarity),
        fbm(coords * frequency + vec3(43.235, 23.112, 0.0), octaves, persistence, lacunarity), 
        0.0
    );
    float noiseSample = fbm(coords * frequency + offset, octaves, persistence, lacunarity);

    vec3 offset2 = vec3(
        fbm(coords * frequency + 4.0 * offset + vec3(15.325, 1.421, 3.235), octaves, persistence, lacunarity),
        fbm(coords * frequency + 4.0 * offset + vec3(4.32, 0.532, 6.234), octaves, persistence, lacunarity), 
        0.0
    );
    noiseSample = fbm(coords * frequency + 4.0 * offset2, octaves, persistence, lacunarity);

    return noiseSample * amplitude;    
}

float Bayer2(vec2 a) { a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
#define Bayer4(a)   (Bayer2(0.5 * (a)) * 0.25 + Bayer2(a))
#define Bayer8(a)   (Bayer4(0.5 * (a)) * 0.25 + Bayer2(a))
#define Bayer16(a)   (Bayer8(0.5 * (a)) * 0.25 + Bayer2(a))

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 mouse = uMouse;
  mouse = (mouse + 1.0) / 2.0;
  mouse.x *= aspectRatio;
  mouse = (mouse - 0.5) * 2.0;

  float CELL_PIXEL_SIZE = uCellPixelSizeMultiplier * uPixelSize;

  vec2 pixelId = floor(fragCoord / uPixelSize); 
  vec2 cellId = floor(fragCoord / CELL_PIXEL_SIZE); 
  vec2 cellCoord = cellId * CELL_PIXEL_SIZE;

  vec2 uv = cellCoord/uResolution * vec2(aspectRatio, 1.0);
  
  // Use domain warping instead of simple waves
  vec3 coords = vec3(uv * uUvMultiplier, uTime * 0.05);
  
  // Create domain warped pattern with animation
  float warpedNoise1 = domainWarpingFBM(coords, uWarp1Amplitude, uWarp1Frequency, uWarp1Octaves, uWarp1Persistence, uWarp1Lacunarity);
  float warpedNoise2 = domainWarpingFBM(coords + vec3(100.0, 50.0, 0.0), uWarp2Amplitude, uWarp2Frequency, uWarp2Octaves, uWarp2Persistence, uWarp2Lacunarity);
  
  // Combine multiple domain warped layers for more complexity
  float mask = (warpedNoise1 + warpedNoise2) * 1.5;

 
  
  // Normalize to 0-1 range
  mask = mask * 0.5 + 0.5;
  
  float dither = Bayer16(pixelId);
  
  mask += dither - 0.5;
  mask = step(0.5, mask);

  vec3 color = uColor * mask;
  gl_FragColor = vec4(color, 1.0);
}
