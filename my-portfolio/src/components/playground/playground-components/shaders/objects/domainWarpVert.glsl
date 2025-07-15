varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vNoise;


void main(){
    vPosition = position;
    vNormal = normal;
    vUv = uv;


    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;


}