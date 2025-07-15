import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import objectsVertexShader from './shaders/objects/vertex.glsl'
import objectsFragmentShader from './shaders/objects/fragment.glsl'
import fragShader1 from './shaders/objects/frag1.glsl'
import vertShader1 from './shaders/objects/vert1.glsl'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';



/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Initialize default values
window.uOctaves = 3
window.uPersistence = 1.59
window.uLacunarity = 1.8
window.uAmplitude = 5.0 

gui.add(window, 'uOctaves', 1, 20).step(1).name('Octaves').onChange(() => {
    recMat.uniforms.uOctaves.value = window.uOctaves;
});

gui.add(window, 'uPersistence', 0.0, 10.0).step(0.01).name('Persistence').onChange(() => {
    recMat.uniforms.uPersistence.value = window.uPersistence;
});

gui.add(window, 'uLacunarity', 1.0, 8.0).step(0.1).name('Lacunarity').onChange(() => {
    recMat.uniforms.uLacunarity.value = window.uLacunarity;
});

gui.add(window, 'uAmplitude', 0.0, 10.0).step(0.1).name('Amplitude').onChange(() => {
    recMat.uniforms.uAmplitude.value = window.uAmplitude;
});


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()
const myTexture = textureLoader.load('./man-of-storr.jpg')
console.log('Texture loaded:', myTexture);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 17)
scene.add(camera)

// Controls
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))






//uniforms
const noiseScale1 = 15.0
const pixelation1 = 5.0 
const blendFactor1 = 1.0
const color3 = new THREE.Color('#0057e7')
const color4 = new THREE.Color('#d62d20')
const radius = 0.19


const recGeo = new THREE.PlaneGeometry(10, 10, 50, 50);
const recMat = new THREE.ShaderMaterial(
    {
        fragmentShader: fragShader1,
        vertexShader: vertShader1,
        uniforms:{
            uMouse: { value: new THREE.Vector2() },
            uTime: new THREE.Uniform(0),
            uNoiseScale1: { value: noiseScale1},
            uPixelation1: { value: pixelation1},
            uBlendFactor1: { value: blendFactor1},
            uColor3: { value: color3},
            uColor4: { value: color4},
            uRadius: { value: radius},
            uTexture: { value: myTexture },
            uOctaves: { value: window.uOctaves },
            uPersistence: { value: window.uPersistence },
            uLacunarity: { value: window.uLacunarity },
            uAmplitude: { value: window.uAmplitude},
            uPrevMouse: { value: new THREE.Vector2() },
            uDeltaTime: { value: 0 },
            },
        side: THREE.DoubleSide,
        
    }
)
const recMesh = new THREE.Mesh(recGeo, recMat)
scene.add(recMesh)
recMesh.position.x = 0





//Mouse Interaction
let prevMousePosition = new THREE.Vector2();
let lastUpdateTime = performance.now();

const onDocumentMouseMove = (event) => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastUpdateTime) / 1000; // Convert to seconds
    lastUpdateTime = currentTime;

    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    recMat.uniforms.uPrevMouse.value.copy(recMat.uniforms.uMouse.value);
    recMat.uniforms.uMouse.value.set(mouseX, mouseY);
    recMat.uniforms.uDeltaTime.value = deltaTime;

    prevMousePosition.set(mouseX, mouseY);
};


window.addEventListener('mousemove', onDocumentMouseMove)


/**
 * Animate
 * 
 */

const clock = new THREE.Clock()
const tick = () =>
{
    // Update controls
    //controls.update()

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const normalizedScroll = windowHeight > 0 ? scrollY / windowHeight : 0
    const noiseAmplitude = normalizedScroll * 0.5

    const time = clock.getElapsedTime()

    //update materials
    recMat.uniforms.uTime.value = time
    





    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()