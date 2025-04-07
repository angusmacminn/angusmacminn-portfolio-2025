import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RestBase } from '../utils/RestBase';
import { formatSkillName } from '../utils/skillMap';
import { HashLink } from 'react-router-hash-link';
import MediaGallery from './MediaGallery';
import HighlightsAccordion from './HighlightsAccordion';
import './SingleWork.css';
import Header from '../components/Header';
import arrow from "../assets/icons/project-arrow.svg"
 

// Simple hook to check for mobile screen size
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener('resize', handleResize);
        
        // Initial check in case the component mounts after initial load
        handleResize(); 

        // Cleanup listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]); // Re-run effect if breakpoint changes

    return isMobile;
};

function SingleWork() {
    const { slug } = useParams();
    const [workData, setWorkData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const isMobile = useIsMobile(); // Use the hook

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
        <>
            <Header />
            <section className="single-work">
                <div className="single-work-container">
                    <div className='top-half'>
                        <div className='top-half-left'>
                            <HashLink smooth to="/#work" className="back-link">← Back to all works</HashLink>
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
                                            <span key={skill} className="skill-tag-single">
                                                {formatSkillName(skillSlug)}
                                            </span>
                                        );
                                    })}
                            </div>
                        </div>
    
                        
                            <div className='media-container'>
                                {/* Media Gallery */}
                                {workData.acf?.media_gallery && workData.acf.media_gallery.length > 0 && (
                                    <div className="work-media">
                                            <MediaGallery mediaItems={workData.acf.media_gallery} restBase={RestBase} />
                                    </div>
                                )}
                                
                                {/* === Conditional Message/Button === */}
                                {workData.acf?.media_gallery && workData.acf.media_gallery.length > 0 && (
                                     (
                                        workData.acf.link_to_project && (
                                            <div className="project-link-container">
                                                <a 
                                                    href={workData.acf.link_to_project} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="project-link-button"
                                                >
                                                    Visit
                                                    <img src={arrow} alt="arrow" />
        
                                                </a>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                            
                        <div className="work-overview">
                            {workData.acf.overview_title && (
                                <h2>{workData.acf.overview_title}</h2>
                            )}
                            {workData.acf.overview_description && (
                                <div className="work-overview-description">
                                    <p>{workData.acf.overview_description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                        <div className='bottom-half'>
                            {/* Highlights Accordion */}
                            <HighlightsAccordion
                                highlights={workData.acf}
                                title={workData.acf.highlights_title}
                                restBase={RestBase}
                            />
                        </div>
                </div>
            </section>
        </>
    );
}

export default SingleWork;