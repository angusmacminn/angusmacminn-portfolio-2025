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
    const [relatedWorks, setRelatedWorks] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchWorkItem = async () => {
            try {
                const response = await fetch(`${RestBase}work?_embed`);
                
                if (response.ok) {
                    const allWorks = await response.json();
                    
                    // Find the work with matching slug
                    const matchingWork = allWorks.find(work => work.slug === slug);
                    
                    if (matchingWork) {
                        setWorkData(matchingWork);
                        
                        // Get other works (excluding current)
                        const otherWorks = allWorks
                            .filter(work => work.slug !== slug)
                            .slice(0, 3); // Limit to 3 related works
                        
                        setRelatedWorks(otherWorks);
                    } else {
                        setError('Work item not found');
                    }
                } else {
                    setError(`Failed to load work items: ${response.status}`);
                }
            } catch (err) {
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
                            <HashLink smooth to="/#work" className="back-link"><img src={arrow} alt="arrow" /> Back to all works</HashLink>
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
                <div className="more-works-section">
                    <h2>More Projects</h2>
                    <div className="more-works-grid">
                        {relatedWorks.map(work => (
                            <Link to={`/work/${work.slug}`} key={work.id} className="related-work-card">
                                {work._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                    <div className="related-work-image">
                                        <img 
                                            src={work._embedded['wp:featuredmedia'][0].source_url} 
                                            alt={work.title.rendered}
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                <div className="related-work-info">
                                    <h3>{work.title.rendered}</h3>
                                    <p className="related-work-year">{work.acf.year}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default SingleWork;