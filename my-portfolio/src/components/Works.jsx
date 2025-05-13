import { useState, useEffect, useRef } from 'react';
import { RestBase } from '../utils/RestBase';
import { Link } from 'react-router-dom';
import "./Works.css";
import arrow from "../assets/icons/project-arrow.svg"
import gsap from 'gsap';

function Works() {
    const restPath = RestBase + 'work';
    const [works, setWorks] = useState([]);
    const [isLoaded, setLoadStatus] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const workSectionRef = useRef(null);

    useEffect(() => {
        // Reset loading state when fetching
        setLoadStatus(false);
        
        const fetchWorks = async () => {
          try {
            // Add cache-busting parameter to prevent browser caching
            const response = await fetch(`${restPath}?_embed&timestamp=${new Date().getTime()}`);
            if (response.ok) {
              const data = await response.json();
              // console.log('Fetched works:', data); // Debug log
              setWorks(data);
              setLoadStatus(true);
            } else {
              console.error('Error response:', response.status);
              setLoadStatus(false);
            }
          } catch (error) {
            console.error('Error fetching works:', error);
            setLoadStatus(false);
          }
        };
        
        fetchWorks();
    }, [restPath]);


    // gsap animation
    useEffect(() => {
      const section = workSectionRef.current;
      if(!section) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(section);
            }
          },
          {
            root: null,
            rootMargin: '0px',
            threshold: 0.2,
          }
        );
        observer.observe(section);



        // cleanup funtion
        return () => {
          if(section) {
            observer.unobserve(section);
          }
        }
    }, []); // This effect runs once on mount to set up the observer

    // gsap animation
    useEffect(() => {
    // Only run animation if the section is visible and works data exists
    if (isVisible && works && works.length > 0) {
      gsap.fromTo('.work-card', {
        opacity: 0,
        y: 100,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.5,
        clearProps: 'transform',
        // Add a delay if needed, e.g., delay: 0.2
      });
    }
  }, [isVisible, works]);
    
    return (
      <div ref={workSectionRef} className="works">
      {!isLoaded ? (<p>Loading works...</p>) : (
        <div className="works-cards">
          {works.length === 0 ? (
            <p>No works found</p>
          ) : (
            works.map(work => {
              // Safely access the featured image URL
              const imageUrl = work._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              // Or, for a specific size like 'medium' (if available):
              // const thumbnailUrl = work._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url || imageUrl;

              return (
                <Link to={`/work/${work.slug}`} className="work-card" key={work.id}>
                  {/* Add the image tag here */}
                  
                  <div className="title-container">
                    <h3>{work.title.rendered}</h3>
                    <div className="arrow-container"><img src={arrow} alt="arrow"/></div>
                  </div>
                  <div className="skills">
                    {work.class_list
                      .filter(className => className.startsWith('skills-'))
                      .map(skill => (
                        <span key={skill} className="skill-tag">
                          {skill.replace('skills-', '').replace('-', ' ')}
                        </span>
                      ))}
                  </div>
                  {imageUrl && (
                    <div className="work-card-thumbnail-container"> {/* Optional: for styling */}
                      <img 
                        src={imageUrl} // or thumbnailUrl
                        alt={work.title.rendered || 'Project thumbnail'} 
                        className="work-card-thumbnail" 
                        loading="lazy"
                      />
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );


}

export default Works;