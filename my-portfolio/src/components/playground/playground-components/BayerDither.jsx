import { useEffect, useRef } from 'react';
import * as THREE from "three";

import fragmentShader from "./shaders/objects/BayerFragment.glsl";
import vertexShader from "./shaders/objects/BayerVertex.glsl";
import './BayerDither.css'

function BayerDither() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const animationRef = useRef(null);


    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return

        const container = containerRef.current;
        const canvas = canvasRef.current;

        const sizes = {
            width: container.clientWidth,
            height: container.clientWidth * 0.75 // 4:3 aspect ratio
        };

        // Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // camera
        const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100 )
        camera.position.set(0, 0, 17);
        scene.add(camera)

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

        const recGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 50, 50);

        // Shader material with all required uniforms from the fragment shader
        const recMat = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(sizes.width, sizes.height) },
                uPixelSize: { value: 0.5 },
                uCellPixelSizeMultiplier: { value: 0.6 },
                uUvMultiplier: { value: 1.9 },
                uWarp1Amplitude: { value: 1.09 },
                uWarp1Frequency: { value: 2.0 },
                uWarp1Octaves: { value: 3 },
                uWarp1Persistence: { value: 0.5 },
                uWarp1Lacunarity: { value: 2.0 },
                uWarp2Amplitude: { value: 0.47 },
                uWarp2Frequency: { value: 1.5 },
                uWarp2Octaves: { value: 4 },
                uWarp2Persistence: { value: 0.6 },
                uWarp2Lacunarity: { value: 1.8 },
                uColor: { value: new THREE.Color('#ff0000') },
                uMouse: { value: new THREE.Vector2(0, 0) }
            },
            side: THREE.DoubleSide,
        });

        const recMesh = new THREE.Mesh(recGeo, recMat);
        scene.add(recMesh);

        // Mouse interaction
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
            
            // Recalculate plane size
            const newPlaneHeight = 2 * Math.tan(fov / 2) * distance;
            const newPlaneWidth = newPlaneHeight * camera.aspect;
            
            // Update geometry
            recGeo.dispose();
            const newGeo = new THREE.PlaneGeometry(newPlaneWidth, newPlaneHeight, 50, 50);
            recMesh.geometry = newGeo;
            
            // Update resolution uniform
            recMat.uniforms.uResolution.value.set(newWidth, newHeight);
            
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
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="bayer-dither-container">
            <canvas ref={canvasRef} className="webgl" />
        </div>
    );
}

export default BayerDither;