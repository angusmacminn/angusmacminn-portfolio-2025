import { useEffect, useRef } from 'react';
import * as THREE from "three";
import fragmentShader from "./shaders/objects/pixelNoiseFrag.glsl";
import vertexShader from "./shaders/objects/pixelNoiseVert.glsl";
import './PixelNoise.css';

function PixelNoise() {
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
        const fov = camera.fov * (Math.PI / 180); // Convert to radians
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

        // Geometry that fills the viewport
        const recGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 50, 50);
        const recMat = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: {
                uMouse: { value: new THREE.Vector2() },
                uTime: new THREE.Uniform(0),
                uNoiseScale1: { value: 150.0 },
                uPixelation1: { value: 5.0 },
                uBlendFactor1: { value: 0.0 },
                uColor3: { value: new THREE.Color('#0057e7') },
                uColor4: { value: new THREE.Color('#d62d20') },
                uRadius: { value: 0.2 },
            },
            side: THREE.DoubleSide,
        });
        const recMesh = new THREE.Mesh(recGeo, recMat);
        scene.add(recMesh);

        // Mouse interaction (relative to canvas)
        const onMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            recMat.uniforms.uMouse.value.set(mouseX, mouseY);
        };

        container.addEventListener('mousemove', onMouseMove);

        // Resize handler
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = newWidth * 0.75;

            // Update camera
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            
            // Recalculate plane size for new aspect ratio
            const newPlaneHeight = 2 * Math.tan(fov / 2) * distance;
            const newPlaneWidth = newPlaneHeight * camera.aspect;
            
            // Update geometry
            recGeo.dispose(); // Clean up old geometry
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
            recGeo.dispose();
            recMat.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="pixel-noise-container">
            <canvas ref={canvasRef} className="webgl" />
        </div>
    );
}

export default PixelNoise; 