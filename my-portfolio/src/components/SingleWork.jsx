import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RestBase } from '../utils/RestBase';
import { formatSkillName } from '../utils/skillMap';
import { HashLink } from 'react-router-hash-link';
import MediaGallery from './MediaGallery';
import HighlightsAccordion from './HighlightsAccordion';
import './SingleWork.css';
import Header from '../components/Header';
import arrow from "../assets/icons/project-arrow.svg"
import Contact from '../components/Contact';
import { gsap } from 'gsap';
import StackedMediaGallery from './StackedMediaGallery';

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
    const restPath = RestBase + 'pages/5?_nocache=1';
    const [restData, setData] = useState([]);
    const [workData, setWorkData] = useState(null);
    const [projectSkills, setProjectSkills] = useState([]);
    const [relatedWorks, setRelatedWorks] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const isMobile = useIsMobile();
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(restPath)
            if ( response.ok ) {
                const data = await response.json()
                setData(data)
                setLoadStatus(true)
            } else {
                setLoadStatus(false)
            }
        }
        fetchData()
    }, [restPath])

    // GSAP animation - card
    useEffect(() => {
        if (workData && containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                {
                    opacity: 0,
                    scale: 0.9,
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity',
                    delay: 0.2,
                }
            );
        }
    }, [workData]);

    // GSAP animation - content
    useEffect(() => {
        if (workData && contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                {   
                    opacity: 0,
                    x: 100,
                },
                {
                    opacity: 1,
                    x: 0,   
                    duration: 0.8,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity',
                    delay: 0.2,
                    stagger: 0.2,
                }
            );
        }
    }, [workData]);

    // Fetch work item and its related works 
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

                        // Extract skills from the current work
                        if (matchingWork.acf?.add_software_and_skills && matchingWork._embedded?.['acf:term']) {
                            const termIds = matchingWork.acf.add_software_and_skills;
                            const allAvailableTerms = matchingWork._embedded['acf:term']
                                .flat()
                                .filter(term => term && typeof term.id !== 'undefined' && typeof term.name !== 'undefined');

                            const resolvedSkills = termIds.map(id => {
                                const termObject = allAvailableTerms.find(term => term.id === id);
                                return termObject ? termObject.name : null;
                            }).filter(name => name !== null);

                            setProjectSkills(resolvedSkills); 
                        }
                        
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
                <div ref={containerRef} className="single-work-container">
                    <div ref={contentRef} className='top-half-left'>
                        <HashLink smooth to="/#work" className="back-link"><img src={arrow} alt="arrow" /> Back to all works</HashLink>
                        <div className="work-title-year">
                            <h1>{workData.title.rendered}</h1>
                            <p>{workData.acf.year}</p>
                        </div>
                        <div className="work-skills">
                            {/* Only display additional skills from ACF */}
                            {projectSkills.length > 0 ? (
                                projectSkills.map((skillName, index) => (
                                    <span key={`${skillName}-${index}`} className="skill-tag-single">
                                        {skillName}
                                    </span>
                                ))
                            ) : (
                                // Optional: message if no ACF skills are found, or leave empty
                                // <p>No specific software/skills listed.</p> 
                                null
                            )}
                        </div>
                        <div className='project-link-container'>
                            {/* === Conditional Message/Button === */}
                            {workData.acf?.link_to_project && (
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
                            )}
                       </div>
                        
                        {(workData.acf.role || workData.acf.responsibilities_list) && (
                            <div className="work-role-section">
                                {workData.acf.role && (
                                    <div className="work-role">
                                        <p className='work-role-title'>Role</p>
                                        <p>{workData.acf.role}</p>
                                    </div>
                                )}
                                
                                {workData.acf.responsibilities_list && workData.acf.responsibilities_list.length > 0 && (
                                    <div className="work-responsibilities">
                                        <p className="work-role-title">Responsibilities</p>
                                        <ul className="responsibilities-list">
                                            {workData.acf.responsibilities_list.map((item, index) => (
                                                <li key={index}>{item.responsibility_item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

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
                
                    <div className='highlights-container'>
                        {/* Highlights Accordion */}
                        <HighlightsAccordion
                            highlights={workData.acf}
                            title={workData.acf.highlights_title}
                            restBase={RestBase}
                        />
                    </div>
                    </div>

                    <div className='media-container'>
                        {/* Stacked Media Gallery */}
                        {workData.acf?.media_gallery && workData.acf.media_gallery.length > 0 && (
                            <div className="work-media-stacked">
                                <StackedMediaGallery mediaItems={workData.acf.media_gallery} restBase={RestBase} />
                            </div>
                        )}
                    </div>
                            
                    
                </div>
                
                {/* More Works Section */}
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
            <Contact pageData={restData}/>

        </>
    );
}

export default SingleWork;