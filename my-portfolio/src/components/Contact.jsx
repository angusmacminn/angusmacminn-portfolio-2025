import React from 'react';

function Contact({ pageData }) {
  // Check if contactData exists
  if (!pageData) {
    return <div>Contact information not available</div>;
  }

  return (
    <section className="contact-section" id="contact">
      <h2>{pageData.acf.contact_title}</h2>
      <p className="contact-tagline">{pageData.acf.contact_tagline}</p>
      
      <div className="contact-info">
        {pageData.acf.my_email && (
          <div className="contact-item">
            <h3>Email</h3>
            <a href={`mailto:${pageData.acf.my_email}`}>{pageData.acf.my_email}</a>
          </div>
        )}
      </div>
      
      <div className="social-links">
        {pageData.acf.linkedin_url && (
          <a 
            href={pageData.acf.linkedin_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            LinkedIn
          </a>
        )}
        
        {pageData.acf.github_url && (
          <a 
            href={pageData.acf.github_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link github"
          >
            GitHub
          </a>
        )}
        
        {pageData.acf.instagram_url && (
          <a 
            href={pageData.acf.instagram_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link instagram"
          >
            Instagram
          </a>
        )}
      </div>
    </section>
  );
}

export default Contact;