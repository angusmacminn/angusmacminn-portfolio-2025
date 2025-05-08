import { useState, useEffect, useRef } from 'react';
import "./About.css";
import { Link } from 'react-router-dom';
import PixelPush from '../scripts/PixelPush';

import { gsap } from 'gsap';


function About({ pageData }) {
  // Safety check for pageData
  if (!pageData) {
    return <div>Loading about section...</div>;
  }
  // Safety check for ACF data
  if (!pageData.acf) {
    return <div>About content not available</div>;
  }
  const { acf } = pageData;

  const [isVisible, setIsVisible] = useState(false);
  const aboutSectionRef = useRef(null);


  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("About section intersecting!");
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(section);

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      console.log("Animating .about-content");
      gsap.fromTo('.about-content', {
        opacity: 0,
        y: 100,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        delay: 0.2,
      });
    }
  }, [isVisible]);
  
  

  return (
    <section ref={aboutSectionRef} className="about-section" id="about">
      {/* Only render if about_title exists */}
      {acf.about_title && (
        <div className="about-title">
           <h2>{acf.about_title}</h2>
        </div>
      )}
      
      {/* Only render if intro_paragraph exists */}
      {acf.intro_paragraph && (
        <div ref={aboutSectionRef} className="about-content">
          <PixelPush />
          <div className="about-text">
            <h2>{acf.intro_paragraph}</h2>
            <Link to="/about" className="about-button">
              More about Angus
            </Link>
          </div>
        </div>
      )}
      

    </section>
  );
}

export default About;
