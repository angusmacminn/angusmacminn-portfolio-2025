import { useState, useEffect } from 'react';
import Header from '../components/Header';
import DotDisplace from '../scripts/DotDisplace';
import PixelPush from '../scripts/PixelPush';
import "./PlaygroundPage.css";
import { gsap } from 'gsap';

// Playground items - hardcoded for now, could be moved to a config file later
const playgroundItems = [
    {
        id: 'dot-displace',
        title: 'Dot Displacement',
        description: 'Interactive particle system with mouse-following displacement effect',
        component: DotDisplace,
        category: 'Interactive',
        technologies: ['Three.js', 'GLSL']
    },
    {
        id: 'pixel-push',
        title: 'Pixel Push',
        description: 'Custom shader experiment with vertex and fragment manipulation',
        component: PixelPush,
        category: 'Shaders',
        technologies: ['WebGL', 'GLSL', 'Three.js']
    }
    // Add more items as you create them
];

function PlaygroundPage() {
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        gsap.fromTo('.playground-title, .playground-intro', {
            opacity: 0,
            y: -100,
        }, {
            opacity: 1, 
            y: 0,
            duration: 1,
            ease: 'power2.inOut',
            clearProps: 'transform,opacity',
            delay: 0.3,
            stagger: 0.3,
        });
    }, []);

    return (
        <>
            <Header />
            <section className="playground-section">
                <div className="playground-title">
                    <h1>Playground</h1>
                </div>

                <div className='playground-intro'>
                    <p>
                        Interactive web experiments, motion graphics, and live demos. 
                        Hover on any item to see it in action, or explore the code behind each experiment.
                    </p>
                </div>

               
            </section>
        </>
    );
}

export default PlaygroundPage;