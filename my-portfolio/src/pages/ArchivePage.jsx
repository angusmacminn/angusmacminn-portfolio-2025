import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import Header from '../components/Header';
import Experiments from '../components/Experiments'; // Keep the same component
import "./ArchivePage.css";
import { gsap } from 'gsap';

function ArchivePage() {
    const [experiments, setExperiments] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                const response = await fetch(`${RestBase}experiment?_embed&per_page=100`);
                console.log("Fetching all experiments from:", `${RestBase}experiment?_embed`);
                
                if (response.ok) {
                    const allExperiments = await response.json();
                    console.log("All experiments:", allExperiments);
                    setExperiments(allExperiments);
                } else {
                    console.error("API error:", response.status);
                    setError(`Failed to load experiments: ${response.status}`);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(`Error: ${err.message}`);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchExperiments();
    }, []);

    useEffect(() => {
        gsap.fromTo('.archive-title, .archive-intro', {
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
            <section className="archive-section">
                <div className="archive-title">
                    <h1>Archive</h1>
                </div>

                <div className='archive-intro'>
                    <p>
                        A collection of past projects, installations, and experiments spanning TouchDesigner, 
                        audio-visual work, and physical installations. These represent my journey through 
                        different creative mediums and technologies.
                    </p>
                </div>
                <div className='experiments-container'>
                    <Experiments 
                        experiments={experiments}
                        isLoaded={isLoaded}
                        error={error}
                    />
                </div>
            </section>
        </>
    );
}

export default ArchivePage;
