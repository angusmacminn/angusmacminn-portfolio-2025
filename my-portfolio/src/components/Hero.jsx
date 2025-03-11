import React from 'react';

function HeroContent({ pageData }) {
  // Check if pageData exists before trying to access its properties
  if (!pageData) {
    return <div>No page data available</div>;
  }
  
  // Check if ACF data exists
  if (!pageData.acf) {
    return <div>Hero content not available</div>;
  }
  
  const { acf } = pageData;
  
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>{acf.name}</h1>
        <h2>{acf.position_title}</h2>
        
      </div>
    </div>
  );
}

export default HeroContent;