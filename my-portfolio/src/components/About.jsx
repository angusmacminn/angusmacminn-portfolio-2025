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
  const buttonRef = useRef(null); // Create a ref for the button



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
        threshold: 0.9,
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
    if (isVisible && h3Ref.current && buttonRef.current && window.SplitText) {
      gsap.set(h3Ref.current, { visibility: 'visible' }); // Make H3 container visible

      const split = new SplitText(h3Ref.current, {
        type: "chars, words",
        charsClass: "split-char",
        wordsClass: "split-word",
        linesClass: "split-line",
      });

      const h3Words = split.words;
      const h3Stagger = 0.05;
      const h3Duration = 0.9;
      const h3AnimationTotalTime = (h3Words.length - 1) * h3Stagger + h3Duration + 0.2; // 0.2 is the initial delay of h3

      gsap.from(h3Words, {
        duration: h3Duration,
        opacity: 0,
        y: 20,
        delay: 0.2, // Initial delay for h3
        rotation: 10,
        ease: "power3.out",
        stagger: {
          each: h3Stagger,
          from: "random",
        },
      });

      gsap.set(buttonRef.current, { visibility: 'visible' }); // Make button visible
      
      gsap.from(buttonRef.current, {
        duration: 0.5,
        opacity: 0,
        y: 20,
        ease: "power3.out",
        delay: h3AnimationTotalTime * 0.7, // Start button animation when h3 is about 70% done
      });

      return () => {
        if (split) {
          split.revert();
        }
      };
    }
  }, [isVisible, acf.intro_paragraph]); // Added acf.intro_paragraph to dependencies for SplitText
  
  

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
            <Link ref={buttonRef} to="/about" className="about-button">
              More about Angus
            </Link>
          </div>
        </div>
      )}
      

    </section>
  );
}

export default About;
