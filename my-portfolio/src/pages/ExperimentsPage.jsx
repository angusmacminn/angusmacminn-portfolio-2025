import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import Experiments from '../components/Experiments';

function ExperimentsPage() {
    const [experiments, setExperiments] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                const response = await fetch(`${RestBase}experiment?_embed`);
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

    return (
        <main>
            <section>
                <div className="experiments-title">
                    <h1>Experiments</h1>
                </div>
                <Experiments 
                    experiments={experiments}
                    isLoaded={isLoaded}
                    error={error}
                />
            </section>
        </main>
    );
}

export default ExperimentsPage;
