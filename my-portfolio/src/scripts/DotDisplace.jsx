import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function DotDisplace() {
    const canvasRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2(-10, -10));
    
    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0D0D0D);

        // Canvas
        const canvas = canvasRef.current;

        // Sizes
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Camera
        const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(0, 0, 100);
        scene.add(camera);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles setup
        let particles, particlePositions = [], originalPositions = [];
        const gridWidth = 50, gridHeight = 50, spacing = 1.0;

        const geometry = new THREE.BufferGeometry();
        const positions = [];
        
        for(let x = -gridWidth / 2; x < gridWidth / 2; x += spacing) {
            for(let y = -gridHeight / 2; y < gridHeight / 2; y += spacing) {
                positions.push(x, y, 0);
                particlePositions.push(new THREE.Vector3(x, y, 0));
                originalPositions.push(new THREE.Vector3(x, y, 0));
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({color: 0xffffff, size: 0.5});
        particles = new THREE.Points(geometry, material);
        scene.add(particles);



        // Event handlers
        const handlePointerMove = (event) => {
            // Only handle mouse events on desktop
            if (event.pointerType === 'mouse') {
                const rect = canvas.getBoundingClientRect();
                mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            }
        };

        const handleTouchMove = (event) => {
            // Don't prevent default on mobile to allow scrolling
            const touch = event.touches[0];
            const rect = canvas.getBoundingClientRect();
            
            // Calculate touch position relative to canvas
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;
            
            // Only update if touch is within canvas bounds
            if (touchX >= 0 && touchX <= rect.width && 
                touchY >= 0 && touchY <= rect.height) {
                mouseRef.current.x = (touchX / rect.width) * 2 - 1;
                mouseRef.current.y = -(touchY / rect.height) * 2 + 1;
            }
        };

        const handleResize = () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        // Add event listeners
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('resize', handleResize);

        // Animation
        const animate = () => {
            const positions = particles.geometry.attributes.position.array;

            for (let i = 0; i < particlePositions.length; i++) {
                let particle = particlePositions[i];
                let original = originalPositions[i];

                let dx = (mouseRef.current.x * gridWidth / 2) - particle.x;
                let dy = (mouseRef.current.y * gridHeight / 2) - particle.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                let force = Math.max(0, 5 - distance) * 0.01;
                let angle = Math.atan2(dy, dx);
                
                particle.x -= Math.cos(angle) * force;
                particle.y -= Math.sin(angle) * force;

                if (distance > 5) {
                    let restorationSpeed = 0.04;
                    particle.x += (original.x - particle.x) * restorationSpeed;
                    particle.y += (original.y - particle.y) * restorationSpeed;
                }

                positions[i * 3] = particle.x;
                positions[i * 3 + 1] = particle.y;
            }

            particles.geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="background-canvas"
            style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'auto',
                touchAction: 'pan-y'
            }}
        />
    );
}

export default DotDisplace;