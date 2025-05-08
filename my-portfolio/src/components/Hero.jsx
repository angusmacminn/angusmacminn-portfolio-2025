import "./Hero.css";
import arrowdown from "../assets/icons/arrowdown.svg";
import { gsap } from 'gsap';
import { useEffect } from "react";


function HeroContent({ pageData }) {
  // Check if pageData exists before trying to access its properties
  if (!pageData) {
    return <div>No page data available</div>;
  }
  
  // Check if ACF data exists
  if (!pageData.acf) {
    return <div>Hero content not available</div>;
  }

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // GSAP animation - hero
  useEffect(() => {
    gsap.fromTo('.hero-content', {
      opacity: 0,
      y: 100,
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.inOut',
      clearProps: 'transform,opacity',
      delay: 0.3,
    });
  }, []);

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
      delay: 0.4,
    });
  }, []);
  
  // Destructure - Extract the acf object from the pageData object
  const { acf } = pageData;
  
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>{acf.name}</h1>
        <h2>{acf.position_title}</h2>
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