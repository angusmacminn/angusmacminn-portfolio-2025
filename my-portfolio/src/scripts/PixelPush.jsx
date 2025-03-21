import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import vertexShader from './pixelPushVertex.glsl';
import fragmentShader from './pixelPushFragment.glsl';
import './PixelPush.css';


function PixelPush() {
    const canvasRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2(-10, -10));
    const timeRef = useRef(0);

useEffect(() => {
    if (!canvasRef.current) return;

    // Get the about-content div dimensions
    const container = document.querySelector('.about-content');
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0D0D0D);
    // Canvas
    const canvas = canvasRef.current;
    // Sizes
    const sizes = {
        width: bounds.width,  // Use container width
        height: bounds.height // Use container height
    };

    // Camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(sizes.width, sizes.height);

    // Simplify your shader for mobile:
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Lower resolution on mobile
    const pixelRatio = isMobile ? Math.min(1.0, window.devicePixelRatio) : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);

    // create a plane
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            u_time: { value: 0 },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_resolution: { value: new THREE.Vector2(sizes.width, sizes.height) }
        }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    

    // Event handlers
    const handlePointerMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Only update if within bounds
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            mouseRef.current.x = (x / rect.width);
            mouseRef.current.y = 1.0 - (y / rect.height);
        }
    };
    const handleTouchMove = (event) => {
        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            mouseRef.current.x = (x / rect.width);
            mouseRef.current.y = 1.0 - (y / rect.height);
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
        timeRef.current += 0.01;
        material.uniforms.u_time.value = timeRef.current;
        material.uniforms.u_mouse.value.copy(mouseRef.current);

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
        geometry.dispose();
        material.dispose();
    };
}, []);

return (
    <canvas 
        ref={canvasRef}
        className="background-canvas"
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
