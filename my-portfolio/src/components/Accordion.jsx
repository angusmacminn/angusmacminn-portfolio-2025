import React from 'react';
import './Accordion.css';

// Main Accordion container
export function Accordion({ children }) {
  return (
    <div className="accordion">
      {children}
    </div>
  );
}

// Individual Accordion Item
export function AccordionItem({ children }) {
  return (
    <div className="accordion-item">
      {children}
    </div>
  );
}

// Accordion Button (the clickable header)
export function AccordionButton({ children, isActive, onClick }) {
  return (
    <button 
      className={`accordion-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-expanded={isActive}
    >
      <span className="accordion-title">{children}</span>
      <span className="accordion-icon">{isActive ? '−' : '+'}</span>
    </button>
  );
}

// Accordion Panel (the content that shows/hides)
export function AccordionPanel({ children, isActive }) {
  return (
    <div 
      className={`accordion-panel ${isActive ? 'active' : ''}`}
      aria-hidden={!isActive}
    >
      <div className="accordion-content">
        {children}
      </div>
    </div>
  );
}