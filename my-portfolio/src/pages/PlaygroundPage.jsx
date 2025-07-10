import { useState, useEffect } from 'react';
import Header from '../components/Header';
import "./PlaygroundPage.css";
import { gsap } from 'gsap';
import FlipCard from '../components/playground/playground-components/FlipCard';
import LoadingSpinner from '../components/playground/playground-components/LoadingSpinner';
import PlaygroundItemWrapper from '../components/playground/PlaygroundWrapper';
import PixelNoise from '../components/playground/playground-components/PixelNoise';


const playgroundItems = [
    {
        id: 'flip-card',
        title: 'Flip Card',
        component: FlipCard,
        technologies: ['React', 'Motion'],
        description: 'Smooth 3D card flip animation on hover'
    },
    {
        id: 'loading-spinner',
        title: 'Loading Spinners',
        component: LoadingSpinner,
        technologies: ['React', 'Motion', 'CSS'],
        description: 'Animated loading indicators with pixel patterns'
    },
    {
        id: 'pixel-noise',
        title: 'Pixel Noise',
        component: PixelNoise,
        technologies: ['Threejs', 'WebGL', 'GLSL'],
        description: 'Interactive noise shader with mouse controls'
    }
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
                <div className='playground-header-container'>
                    <div className="playground-title">
                        <h1>Playground</h1>
                    </div>
    
                    <div className='playground-intro'>
                        <p>
                            Interactive web experiments, motion graphics, and live demos. 
                            Hover on any item to see it in action, or explore the code behind each experiment.
                        </p>
                    </div>
                </div>

                <div className="playground-container">
                {playgroundItems.map((item) => {
                        const Component = item.component;
                        return (
                            <PlaygroundItemWrapper
                                key={item.id}
                                title={item.title}
                                technologies={item.technologies}
                                description={item.description}
                            >
                                <Component />
                            </PlaygroundItemWrapper>
                        );
                    })}
                </div>
            </section>
        </>
    );
}

export default PlaygroundPage;