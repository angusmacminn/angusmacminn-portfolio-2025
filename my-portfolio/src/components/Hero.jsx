import "./Hero.css";
import arrowdown from "../assets/icons/arrowdown.svg";
import { gsap } from 'gsap';
import { useEffect, useRef } from "react";


function HeroContent({ pageData }) {
  // Check if pageData exists before trying to access its properties
  if (!pageData) {
    return <div>No page data available</div>;
  }
  
  // Check if ACF data exists
  if (!pageData.acf) {
    return <div>Hero content not available</div>;
  }

  const h1Ref = useRef(null); // Ref for the h1
  const h2Ref = useRef(null); // Ref for the h2

  const scrollToWork = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // GSAP animation for H1 and H2 using SplitText
  useEffect(() => {
    // Ensure SplitText is available globally and refs are set
    if (window.SplitText && h1Ref.current && h2Ref.current) {
      
      // First, make the parent h1 visible. Its characters will be animated from opacity 0.
      gsap.set(h1Ref.current, { visibility: 'visible' }); 
      
      const splitH1 = new SplitText(h1Ref.current, {
        type: "chars, words",
        charsClass: "hero-h1-char",
        wordsClass: "hero-h1-word",
      });

      gsap.from(splitH1.chars, {
        duration: 0.8,
        opacity: 0, // Characters will animate from opacity 0 to 1
        y: 50,
        ease: "power3.out",
        stagger: {
          each: 0.09,
          from: "random"
        },
        delay: 0.3,
      });

      // Make the parent h2 visible.
      gsap.set(h2Ref.current, { visibility: 'visible' });

      const splitH2 = new SplitText(h2Ref.current, {
        type: "chars, words",
        charsClass: "hero-h2-char",
        wordsClass: "hero-h2-word",
      });

      gsap.from(splitH2.chars, {
        duration: 0.6,
        opacity: 0, // Characters will animate from opacity 0 to 1
        y: 30,
        ease: "power2.out",
        stagger: {
          each: 0.03,
          from: "start"
        },
        delay: 0.6, 
      });
      
      // Cleanup function to revert SplitText instances
      return () => {
        if (splitH1) splitH1.revert();
        if (splitH2) splitH2.revert();
      };
    }
  }, [pageData.acf.name, pageData.acf.position_title]);

  useEffect(() => {
    gsap.fromTo('.hero-arrowdown', {
      opacity: 0,
      y: -100,
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.inOut',
      clearProps: 'transform,opacity',
      delay: 1.2, // Ensure this delay is appropriate after text animations
    });
  }, []);
  
  // Destructure - Extract the acf object from the pageData object
  const { acf } = pageData;
  
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 ref={h1Ref}>{acf.name}</h1>
        <h2 ref={h2Ref}>{acf.position_title}</h2>
      </div>
      <div className="hero-arrowdown" onClick={scrollToWork}>
        <img src={arrowdown} 
             alt="arrowdown" 
             className="bounce-animation"
             aria-label="Scroll to work section"
             />
      </div>
    </section>
  );
}

export default HeroContent;