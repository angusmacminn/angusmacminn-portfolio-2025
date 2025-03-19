import React from 'react';
import "./About.css";
import { Link } from 'react-router-dom';


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

  return (
    <section className="about-section" id="about">
      {/* Only render if about_title exists */}
      {<div className="about-title">
        {acf.about_title && <h2>{acf.about_title}</h2>}
      </div>}
      
      {/* Only render if intro_paragraph exists */}
      {acf.intro_paragraph && (
        <div className="about-content">
          <p>{acf.intro_paragraph}</p>
          <Link to="/about" className="about-button">
            More about Angus
          </Link>
        </div>
      )}
      

    </section>
  );
}

export default About;
