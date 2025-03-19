import React from 'react';
import "./Hero.css";
import arrowdown from "../assets/icons/arrowdown.svg";

function HeroContent({ pageData }) {
  // Check if pageData exists before trying to access its properties
  if (!pageData) {
    return <div>No page data available</div>;
  }
  
  // Check if ACF data exists
  if (!pageData.acf) {
    return <div>Hero content not available</div>;
  }
  
  // Destructure - Extract the acf object from the pageData object
  const { acf } = pageData;
  
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>{acf.name}</h1>
        <h2>{acf.position_title}</h2>
      </div>
      <div className="hero-arrowdown">
        <img src={arrowdown} alt="arrowdown" />
      </div>
    </section>
  );
}

export default HeroContent;