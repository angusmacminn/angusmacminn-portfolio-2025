import { useState, useEffect } from 'react';
import './Experiments.css';

function Experiments({ experiments, isLoaded, error }) {
    // Group experiments by technology
    const grouped = experiments.reduce((acc, experiment) => {
        const technology = experiment._embedded['wp:term'][0][0];
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

    return (
        <div className="experiments-container">
            {Object.entries(grouped).map(([technology, techExperiments]) => (
                <div key={technology} className="technology-group">
                    <h2 className="technology-title">{technology}</h2>
                    <div className="experiments-grid">
                        {techExperiments.map(experiment => (
                            <div key={experiment.id} className="experiment-card">
                                <h3>{experiment.title.rendered}</h3>
                               
                                
                                
                                <div 
                                    className="experiment-content"
                                    dangerouslySetInnerHTML={{ __html: experiment.content.rendered }}
                                />
                                 <p>{experiment.acf.experiment_description}</p>
                                 {experiment.acf.experiment_link && (
                                    <a 
                                        href={experiment.acf.experiment_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        View Experiment
                                    </a>
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
