import { useEffect, useRef } from 'react';
import * as THREE from "three";
import fragmentShader from "./shaders/objects/domainWarpFrag.glsl";
import vertexShader from "./shaders/objects/domainWarpVert.glsl";
import './DomainWarping.css';

function DomainWarping() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;

        // Sizes based on container
        const sizes = {
            width: container.clientWidth,
            height: container.clientWidth * 0.75 // 4:3 aspect ratio
        };

        // Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(0, 0, 17);
        scene.add(camera);

        // Calculate plane size to fill viewport
        const fov = camera.fov * (Math.PI / 180);
        const distance = camera.position.z;
        const planeHeight = 2 * Math.tan(fov / 2) * distance;
        const planeWidth = planeHeight * camera.aspect;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        // Texture loader
        const textureLoader = new THREE.TextureLoader();
        const myTexture = textureLoader.load('./man-of-storr.jpg');

        // Shader material with fixed uniforms syntax
        const recGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 50, 50);
        const recMat = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: {
                uMouse: { value: new THREE.Vector2() },
                uTime: { value: 0 },                          // Fixed syntax
                uNoiseScale1: { value: 15.0 },
                uPixelation1: { value: 5.0 },
                uBlendFactor1: { value: 1.0 },
                uColor3: { value: new THREE.Color('#0057e7') },
                uColor4: { value: new THREE.Color('#d62d20') },
                uRadius: { value: 0.19 },
                uTexture: { value: myTexture },
                uOctaves: { value: 3 },
                uPersistence: { value: 1.59 },
                uLacunarity: { value: 1.8 },
                uAmplitude: { value: 5.0 },
                uPrevMouse: { value: new THREE.Vector2() },
                uDeltaTime: { value: 0 },
            },
            side: THREE.DoubleSide,
        });
        const recMesh = new THREE.Mesh(recGeo, recMat);
        scene.add(recMesh);

        // Mouse interaction with delta time tracking
        let lastUpdateTime = performance.now();
        
        const onMouseMove = (event) => {
            const currentTime = performance.now();
            const deltaTime = (currentTime - lastUpdateTime) / 1000;
            lastUpdateTime = currentTime;

            const rect = canvas.getBoundingClientRect();
            const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Copy current mouse to previous mouse
            recMat.uniforms.uPrevMouse.value.copy(recMat.uniforms.uMouse.value);
            recMat.uniforms.uMouse.value.set(mouseX, mouseY);
            recMat.uniforms.uDeltaTime.value = deltaTime;
        };

        container.addEventListener('mousemove', onMouseMove);

        // Resize handler
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = newWidth * 0.75;

            // Update camera
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            
            // Recalculate plane size
            const newPlaneHeight = 2 * Math.tan(fov / 2) * distance;
            const newPlaneWidth = newPlaneHeight * camera.aspect;
            
            // Update geometry
            recGeo.dispose();
            const newGeo = new THREE.PlaneGeometry(newPlaneWidth, newPlaneHeight, 50, 50);
            recMesh.geometry = newGeo;
            
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        const clock = new THREE.Clock();
        const tick = () => {
            const time = clock.getElapsedTime();
            recMat.uniforms.uTime.value = time;
            
            renderer.render(scene, camera);
            animationRef.current = requestAnimationFrame(tick);
        };
        tick();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('mousemove', onMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            // Dispose of resources
            recGeo.dispose();
            recMat.dispose();
            myTexture.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="domain-warping-container">
            <canvas ref={canvasRef} className="webgl" />
        </div>
    );
}

export default DomainWarping;