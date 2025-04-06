import { useState, useEffect } from 'react';
import './Experiments.css';

// Define the desired order of technologies
const desiredTechnologyOrder = [
    'Installations', 
    'Three.js / WebGL', 
    'TouchDesigner', 
    'Audio-Visual', 
    // Add other technology names in your preferred order
];

function Experiments({ experiments, isLoaded, error }) {
    // Group experiments by technology
    const grouped = experiments.reduce((acc, experiment) => {
        // Ensure _embedded and wp:term exist before accessing
        const terms = experiment._embedded?.['wp:term']?.[0];
        if (!terms || terms.length === 0) {
            console.warn(`Experiment ID ${experiment.id} has no terms.`);
            return acc; // Skip experiments without terms
        }
        const technology = terms[0];
        const techName = technology.name;
        
        if (!acc[techName]) {
            acc[techName] = [];
        }
        
        acc[techName].push(experiment);
        return acc;
    }, {});

    if (!isLoaded) {
        return <p>Loading experiments...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    // Convert grouped object to an array and sort it
    const sortedGroups = Object.entries(grouped).sort(([techA], [techB]) => {
        const indexA = desiredTechnologyOrder.indexOf(techA);
        const indexB = desiredTechnologyOrder.indexOf(techB);

        // If both technologies are in the desired order array, sort by their index
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        // If only techA is in the array, it comes first
        if (indexA !== -1) {
            return -1;
        }
        // If only techB is in the array, it comes first
        if (indexB !== -1) {
            return 1;
        }
        // If neither is in the array, sort them alphabetically (or keep original order)
        return techA.localeCompare(techB); 
    });

    return (
        <div className="experiments-container">
            {/* Map over the *sorted* groups */}
            {sortedGroups.map(([technology, techExperiments]) => (
                <div key={technology} className="technology-group">
                    <h2 className="technology-title">{technology}</h2>
                    <div className="experiments-grid">
                        {techExperiments.map(experiment => (
                            <div key={experiment.id} className="experiment-card">
                                <h3>{experiment.title.rendered}</h3>
                                {/* Check if acf and experiment_description exist */}
                                {experiment.acf?.experiment_description && (
                                    <div className='experiment-description'>
                                        <p>{experiment.acf.experiment_description}</p>
                                    </div>
                                )}
                                {experiment.acf?.experiment_link && (
                                    <a 
                                        href={experiment.acf.experiment_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="experiment-link" // Added class for potential styling
                                    >
                                        View Experiment
                                    </a>
                                )}
                                 {/* Check if content and rendered exist */}
                                {experiment.content?.rendered && (
                                    <div 
                                        className="experiment-content"
                                        dangerouslySetInnerHTML={{ __html: experiment.content.rendered }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Experiments;
