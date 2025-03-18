import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import objectsVertexShader from './shaders/objects/vertex.glsl'
import objectsFragmentShader from './shaders/objects/fragment.glsl'



/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0D0D0D)

// Loaders
const textureLoader = new THREE.TextureLoader()

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

const mouse = new THREE.Vector2(-10, -10);
document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 100)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * obj
 */


// const material = new THREE.ShaderMaterial(
//         {
//             vertexShader: objectsVertexShader,
//             fragmentShader: objectsFragmentShader,

//             uniforms: {
//                 uTime: { value: 0.0},
//                 uNoiseAmplitude: { value: 0.0 },
//                 uMouse: { value: new THREE.Vector2},
//             }
//         }
//     )
let particles, particlePositions = [], originalPositions = []

const gridWidth = 50, gridHeight = 50, spacing = 1.0;

let geometry = new THREE.BufferGeometry()
let positions = []
for(let x = -gridWidth / 2; x < gridWidth / 2; x += spacing){ // Start from -gridWidth/2 to center
    for(let y = -gridHeight / 2; y < gridHeight / 2; y += spacing){ // Start from -gridHeight/2 to center
        positions.push(x, y, 0) // each particle is positioned in a grid
        particlePositions.push(new THREE.Vector3(x, y, 0))
        originalPositions.push(new THREE.Vector3(x, y, 0));  // Store original position
    }
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
let material = new THREE.PointsMaterial({color: 0xffffff, size: 0.5})
particles = new THREE.Points(geometry, material)
scene.add(particles)

/**
 * Animate
 * 
 */

const matrix = new THREE.Matrix4()

const clock = new THREE.Clock()
const tick = () =>
{
    const time = clock.getElapsedTime()

    let positions = particles.geometry.attributes.position.array;
    
    for (let i = 0; i < particlePositions.length; i++) {
     
        let particle = particlePositions[i];
        let original = originalPositions[i];

        // Calculate distance from particle to mouse
        let dx = (mouse.x * gridWidth / 2) - particle.x;
        let dy = (mouse.y * gridHeight / 2) - particle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate displacement (repulsive force)
        let force = Math.max(0, 5 - distance) * 0.01;
        let angle = Math.atan2(dy, dx);
        // this gets horizontal component of force vector
        particle.x -= Math.cos(angle) * force;
        // this gets vertical component of force vector
        particle.y -= Math.sin(angle) * force;

        // Restoration force (towards the original position)
        if (distance > 5) {  // Only apply if particle is far from the mouse
            let restorationSpeed = 0.04;  // Adjust this to control the return speed
            particle.x += (original.x - particle.x) * restorationSpeed;
            particle.y += (original.y - particle.y) * restorationSpeed;
        }

        // Apply updated position to the geometry
        positions[i * 3] = particle.x;
        positions[i * 3 + 1] = particle.y;
    }

    particles.geometry.attributes.position.needsUpdate = true;


    // for (let i = 0; i < 1000; i++){
    //     mesh.getMatrixAt(i, matrix)
    //     matrix.decompose(dummy.position, dummy.rotation, dummy.scale)

    //     dummy.rotation.x = i/10 * time /100
    //     dummy.rotation.y = i/10 * time /50
    //     dummy.rotation.z = i/10 * time /120
    
    //     dummy.updateMatrix()
    //     mesh.setMatrixAt(i, dummy.matrix)
    //     mesh.setColorAt(i, new THREE.Color(Math.random() * 0XFFFFFF))

    //     console.log(dummy.rotation.x)
    // }
    // mesh.instanceMatrix.needsUpdate = true

    // Update controls
    controls.update()

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const normalizedScroll = windowHeight > 0 ? scrollY / windowHeight : 0
    const noiseAmplitude = normalizedScroll * 0.5

   




    // material.uniforms.uTime.value = time * 0.5;
    // material.uniforms.uMouse.value = mouse;



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()