import React, { useState, useEffect } from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from './Accordion';
import MediaGallery from './MediaGallery';
import './HighlightsAccordion.css';

function HighlightsAccordion({ highlights, title, restBase }) {
  const [activeIndex, setActiveIndex] = useState(null);

  // Check if we have valid highlights data
  if (!highlights || !highlights.project_highlights) {
    return null;
  }

  const { project_highlights } = highlights;
  const hasFeatures = project_highlights.features && project_highlights.features.length > 0;
  const hasDesign = project_highlights.design && project_highlights.design.length > 0;

  // If no highlights, don't render anything
  if (!hasFeatures && !hasDesign) {
    return null;
  }

  // Function to convert image IDs to media gallery format
  const convertToMediaItems = (imageIds) => {
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return null;
    }
    
    return imageIds.map(id => ({
      type: 'image',
      image: id,
      video_url: '',
      video_file: ''
    }));
  };

  return (
    <div className="highlights-section">
      <h2>{title || 'Highlights'}</h2>
      
      <Accordion>
        {/* Features Section */}
        {hasFeatures && (
          <AccordionItem>
            <AccordionButton 
              isActive={activeIndex === 0}
              onClick={() => setActiveIndex(activeIndex === 0 ? null : 0)}
            >
              Features
            </AccordionButton>
            <AccordionPanel isActive={activeIndex === 0}>
              {project_highlights.features.map((feature, index) => (
                <div key={index} className="highlight-item">
                  <p className="highlight-text">{feature.feature_text}</p>
                  
                  {feature.feature_images && feature.feature_images.length > 0 && (
                    <div className="highlight-media">
                      <MediaGallery 
                        mediaItems={convertToMediaItems(feature.feature_images)} 
                        restBase={restBase} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>
        )}
        
        {/* Design Section */}
        {hasDesign && (
          <AccordionItem>
            <AccordionButton 
              isActive={activeIndex === 1}
              onClick={() => setActiveIndex(activeIndex === 1 ? null : 1)}
            >
              Design
            </AccordionButton>
            <AccordionPanel isActive={activeIndex === 1}>
              {project_highlights.design.map((design, index) => (
                <div key={index} className="highlight-item">
                  <p className="highlight-text">{design.design_text}</p>
                  
                  {design.design_images && design.design_images.length > 0 && (
                    <div className="highlight-media">
                      <MediaGallery 
                        mediaItems={convertToMediaItems(design.design_images)} 
                        restBase={restBase} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}

export default HighlightsAccordion;

