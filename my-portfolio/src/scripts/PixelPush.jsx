import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import vertexShader from './pixelPushVertex.glsl';
import fragmentShader from './pixelPushFragment.glsl';

function PixelPush() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const sceneRef = useRef(null);
    const requestRef = useRef(null);

    // Setup Intersection Observer
    useEffect(() => {
        const options = {
            root: null, // use viewport as root
            rootMargin: '0px',
            threshold: 0.1 // trigger when at least 10% is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setIsVisible(entry.isIntersecting);
            });
        }, options);

        const container = document.querySelector('.about-content');
        if (container) {
            containerRef.current = container;
            observer.observe(container);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    // Setup and handle Three.js scene
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // Only initialize the scene without starting animation
        const bounds = containerRef.current.getBoundingClientRect();
        
        // Setup renderer
        const canvas = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(bounds.width, bounds.height);
        
        // Setup scene
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        // Create objects
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_backgroundColor: { value: new THREE.Vector3(0.95, 0.95, 0.95) },
                u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_resolution: { value: new THREE.Vector2(bounds.width, bounds.height) },
                u_time: { value: 0.0 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Store references for animation
        sceneRef.current = {
            scene,
            camera,
            renderer,
            material,
            geometry,
            time: 0,
            mousePos: new THREE.Vector2(0.5, 0.5)
        };

        // Handle mouse movement
        const handlePointerMove = (event) => {
            if (!sceneRef.current) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                sceneRef.current.mousePos.x = x / rect.width;
                sceneRef.current.mousePos.y = 1.0 - (y / rect.height);
            }
        };

        canvas.addEventListener('pointermove', handlePointerMove);

        // Handle resize
        const handleResize = () => {
            if (!sceneRef.current || !containerRef.current) return;
            
            const newBounds = containerRef.current.getBoundingClientRect();
            sceneRef.current.renderer.setSize(newBounds.width, newBounds.height);
            
            if (sceneRef.current.material.uniforms.u_resolution) {
                sceneRef.current.material.uniforms.u_resolution.value.set(
                    newBounds.width, 
                    newBounds.height
                );
            }
        };

        window.addEventListener('resize', handleResize);

        // Render once initially
        renderer.render(scene, camera);

        return () => {
            // Cleanup
            cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('resize', handleResize);
            
            if (sceneRef.current) {
                sceneRef.current.geometry.dispose();
                sceneRef.current.material.dispose();
                sceneRef.current.renderer.dispose();
            }
        };
    }, []);

    // Handle animation based on visibility
    useEffect(() => {
        if (!sceneRef.current) return;

        // Start or stop animation based on visibility
        if (isVisible) {
            console.log('Component is visible, starting animation');
            
            const animate = () => {
                if (!sceneRef.current) return;
                
                const { scene, camera, renderer, material, mousePos } = sceneRef.current;
                
                // Update time
                sceneRef.current.time += 0.01;
                
                // Update uniforms
                if (material.uniforms.u_time) {
                    material.uniforms.u_time.value = sceneRef.current.time;
                }
                if (material.uniforms.u_mouse) {
                    material.uniforms.u_mouse.value = mousePos;
                }
                
                // Render
                renderer.render(scene, camera);
                requestRef.current = requestAnimationFrame(animate);
            };
            
            requestRef.current = requestAnimationFrame(animate);
        } else {
            console.log('Component is not visible, stopping animation');
            cancelAnimationFrame(requestRef.current);
        }

        return () => {
            cancelAnimationFrame(requestRef.current);
        };
    }, [isVisible]);

    return (
        <canvas 
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'auto',
                touchAction: 'pan-y',
                zIndex: 0
            }}
        />
    );
}

export default PixelPush;