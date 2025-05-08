import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import Header from '../components/Header';
import Experiments from '../components/Experiments';
import "./ExperimentsPage.css";
import { gsap } from 'gsap';

function ExperimentsPage() {
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
        gsap.fromTo('.experiments-title, .experiments-intro', {
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

    useEffect(() => {
        gsap.fromTo('.experiments-container', {
            opacity: 0,
            x: 100,
        }, {
            opacity: 1, 
            x: 0,
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
            <section className="experiments-section">
                <div className="experiments-title">
                    <h1>Experiments</h1>
                </div>

                <div className='experiments-intro'>
                    <p>
                        These are a collection of projects and experiments I've worked on.
                        They vary in complexity and scope, but all are a reflection of my learning and growth as a creative developer and lover of making pixels move on screens.
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

export default ExperimentsPage;
