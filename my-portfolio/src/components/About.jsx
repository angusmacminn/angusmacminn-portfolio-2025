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
  const h3Ref = useRef(null); // Create a new ref for the h3 element



  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section) return;

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
    if (isVisible && h3Ref.current && window.SplitText) {
      const split = new SplitText(h3Ref.current, {
        type: "chars",
        charsClass: "split-char",
        wordsClass: "split-word",
        linesClass: "split-line",
      });

      gsap.from(split.chars, {
        duration: 0.9,
        opacity: 0,
        y: 20,
        delay: 0.2,
        rotation: 10,
        ease: "power3.out",
        stagger: {
          each: 0.05,
          from: "start",
        },
      });

      return () => {
        if (split) {
          split.revert();
        }
      };
    }
  }, [isVisible]);
  
  

  return (
    <section ref={aboutSectionRef} className="about-section" id="about">
      {/* Only render if about_title exists */}
      {acf.about_title && (
        <div className="about-title">
           {/* <h2>{acf.about_title}</h2> */}
        </div>
      )}
      
      {/* Only render if intro_paragraph exists */}
      {acf.intro_paragraph && (
        <div className="about-content">
          <PixelPush />
          <div className="about-text">
            <h3 ref={h3Ref}>{acf.intro_paragraph}</h3>
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
