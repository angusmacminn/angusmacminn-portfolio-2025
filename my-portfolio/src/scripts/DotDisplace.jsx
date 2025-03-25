import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function DotDisplace() {
    const canvasRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2(-10, -10));
    const sceneRef = useRef(null);
    const requestRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    
    // Calculate grid dimensions based on screen size
    const calculateGridDimensions = () => {
        const baseSpacing = 1.5;
        const aspectRatio = window.innerWidth / window.innerHeight;
        
        // Increase base size and add padding
        const baseSize = Math.max(60, Math.floor(window.innerWidth / 15));
        
        return {
            gridWidth: Math.ceil(baseSize * aspectRatio) + 10, // Add padding
            gridHeight: baseSize + 10, // Add padding
            spacing: baseSpacing
        };
    };

    // Setup Intersection Observer
    useEffect(() => {
        if (!canvasRef.current) return;
        
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setIsVisible(entry.isIntersecting);
            });
        }, options);

        observer.observe(canvasRef.current);

        return () => {
            if (canvasRef.current) {
                observer.unobserve(canvasRef.current);
            }
        };
    }, []);
    
    // Setup Three.js scene
    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0D0D0D);

        const canvas = canvasRef.current;
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Adjust camera FOV and position
        const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
        // Move camera back to show more of the scene
        camera.position.set(0, 0, 80);
        scene.add(camera);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Get initial grid dimensions
        const { gridWidth, gridHeight, spacing } = calculateGridDimensions();
        
        // Particles setup
        let particles, particlePositions = [], originalPositions = [];
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        
        // Create grid with calculated dimensions
        for(let x = -gridWidth / 2; x < gridWidth / 2; x += spacing) {
            for(let y = -gridHeight / 2; y < gridHeight / 2; y += spacing) {
                positions.push(x, y, 0);
                particlePositions.push(new THREE.Vector3(x, y, 0));
                originalPositions.push(new THREE.Vector3(x, y, 0));
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.6 // Increased from 0.5
        });
        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Store references
        sceneRef.current = {
            scene,
            camera,
            renderer,
            particles,
            particlePositions,
            originalPositions,
            geometry,
            material,
            sizes,
            gridWidth,
            gridHeight
        };

        // Event handlers
        const handlePointerMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            
            // Convert mouse position to normalized device coordinates (-1 to +1)
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Convert to world coordinates
            const vector = new THREE.Vector3(x, y, 0);
            vector.unproject(camera);
            vector.sub(camera.position).normalize();
            const distance = -camera.position.z / vector.z;
            const worldPos = camera.position.clone().add(vector.multiplyScalar(distance));
            
            mouseRef.current.x = worldPos.x;
            mouseRef.current.y = worldPos.y;
        };

        const handleTouchMove = (event) => {
            const touch = event.touches[0];
            const rect = canvas.getBoundingClientRect();
            
            // Convert touch position to normalized device coordinates (-1 to +1)
            const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Convert to world coordinates
            const vector = new THREE.Vector3(x, y, 0);
            vector.unproject(camera);
            vector.sub(camera.position).normalize();
            const distance = -camera.position.z / vector.z;
            const worldPos = camera.position.clone().add(vector.multiplyScalar(distance));
            
            mouseRef.current.x = worldPos.x;
            mouseRef.current.y = worldPos.y;
        };

        // Enhanced resize handler
        const handleResize = () => {
            if (!sceneRef.current) return;
            
            // Update sizes
            const newSizes = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            
            // Update camera
            camera.aspect = newSizes.width / newSizes.height;
            camera.updateProjectionMatrix();
            
            // Recalculate grid dimensions
            const { gridWidth, gridHeight, spacing } = calculateGridDimensions();
            
            // Update particles
            const newPositions = [];
            const newParticlePositions = [];
            const newOriginalPositions = [];
            
            for(let x = -gridWidth / 2; x < gridWidth / 2; x += spacing) {
                for(let y = -gridHeight / 2; y < gridHeight / 2; y += spacing) {
                    newPositions.push(x, y, 0);
                    newParticlePositions.push(new THREE.Vector3(x, y, 0));
                    newOriginalPositions.push(new THREE.Vector3(x, y, 0));
                }
            }
            
            // Update geometry
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
            
            // Update references
            sceneRef.current.particlePositions = newParticlePositions;
            sceneRef.current.originalPositions = newOriginalPositions;
            sceneRef.current.gridWidth = gridWidth;
            sceneRef.current.gridHeight = gridHeight;
            sceneRef.current.sizes = newSizes;
            
            // Update renderer
            renderer.setSize(newSizes.width, newSizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        // Add event listeners
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: true }); // Changed to passive: true
        window.addEventListener('resize', handleResize);

        // Initial render
        renderer.render(scene, camera);

        // Cleanup
        return () => {
            cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('touchmove', handleTouchMove);
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

        if (isVisible) {
            console.log('DotDisplace is visible, starting animation');

            const animate = () => {
                if (!sceneRef.current) return;
                
                const { 
                    scene, 
                    camera, 
                    renderer, 
                    particles, 
                    particlePositions, 
                    originalPositions
                } = sceneRef.current;
                
                const positions = particles.geometry.attributes.position.array;

                for (let i = 0; i < particlePositions.length; i++) {
                    let particle = particlePositions[i];
                    let original = originalPositions[i];

                    // Direct distance calculation without scaling
                    let dx = mouseRef.current.x - particle.x;
                    let dy = mouseRef.current.y - particle.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Adjust force and radius of influence
                    let radius = 8;
                    let force = Math.max(0, radius - distance) * 0.015;
                    let angle = Math.atan2(dy, dx);
                    
                    particle.x -= Math.cos(angle) * force;
                    particle.y -= Math.sin(angle) * force;

                    if (distance > radius) {
                        let restorationSpeed = 0.04;
                        particle.x += (original.x - particle.x) * restorationSpeed;
                        particle.y += (original.y - particle.y) * restorationSpeed;
                    }

                    positions[i * 3] = particle.x;
                    positions[i * 3 + 1] = particle.y;
                }

                particles.geometry.attributes.position.needsUpdate = true;
                renderer.render(scene, camera);
                requestRef.current = requestAnimationFrame(animate);
            };

            requestRef.current = requestAnimationFrame(animate);
        } else {
            console.log('DotDisplace is not visible, stopping animation');
            cancelAnimationFrame(requestRef.current);
        }

        return () => {
            cancelAnimationFrame(requestRef.current);
        };
    }, [isVisible]);

    return (
        <canvas 
            ref={canvasRef} 
            className="background-canvas"
            style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'auto',
                touchAction: 'pan-y' // Changed to pan-y to allow vertical scrolling
            }}
        />
    );
}

export default DotDisplace;