import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RestBase } from '../utils/RestBase';
import { formatSkillName } from '../utils/skillMap';
import MediaGallery from './MediaGallery';
import HighlightsAccordion from './HighlightsAccordion';

function SingleWork() {
    const { slug } = useParams();
    const [workData, setWorkData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkItem = async () => {
            try {
                // Fetch all work items
                const response = await fetch(`${RestBase}work?_embed`);
                console.log("Fetching all works from:", `${RestBase}work?_embed`);
                
                if (response.ok) {
                    const allWorks = await response.json();
                    console.log("All works:", allWorks);
                    
                    // Find the work with matching slug
                    const matchingWork = allWorks.find(work => work.slug === slug);
                    
                    if (matchingWork) {
                        console.log("Found matching work:", matchingWork);
                        setWorkData(matchingWork);
                    } else {
                        console.error("No work found with slug:", slug);
                        setError('Work item not found');
                    }
                } else {
                    console.error("API error:", response.status);
                    setError(`Failed to load work items: ${response.status}`);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(`Error: ${err.message}`);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchWorkItem();
    }, [slug]);

    if (!isLoaded) {
        return <div className="loading-container">
            <p>Loading work item...</p>
        </div>
    }

    if (error) {
        return <div className="error-container">
            <p>{error}</p>
        </div>
    }
    
    if (!workData) {
        return <div className="not-found">Work item not found</div>;
    }

    return (
        <main>
            <section className="single-work">
                <Link to="/" className="back-link">← Back to all works</Link>
                <div className="work-title-year">
                    <h1>{workData.title.rendered}</h1>
                    <p>{workData.acf.year}</p>
                </div>

                <div className="work-skills">
                {workData.class_list
                                .filter(className => className.startsWith('skills-'))
                                .map(skill => {
                                  // Remove the 'skills-' prefix
                                  const skillSlug = skill.replace('skills-', '');
                                  
                                  return (
                                    <span key={skill} className="skill-tag">
                                      {formatSkillName(skillSlug)}
                                    </span>
                                  );
                                })}
                </div>

                <section className="work-overview">
                    {/* Media Gallery */}
                    {workData.acf?.media_gallery && workData.acf.media_gallery.length > 0 && (
                        <div className="work-media">
                        <MediaGallery mediaItems={workData.acf.media_gallery} restBase={RestBase} />
                        </div>
                    )}
                    {workData.acf.overview_title && (
                        <h2>{workData.acf.overview_title}</h2>
                    )}
                    {workData.acf.overview_description && (
                        <div className="work-overview-description">
                            {workData.acf.overview_description}
                        </div>
                    )}

                    {/* Highlights Accordion */}
                    <HighlightsAccordion
                        highlights={workData.acf}
                        title={workData.acf.highlights_title}
                        restBase={RestBase}
                    />
                </section>

                
                
                
            </section>
        </main>
    );
}

export default SingleWork;