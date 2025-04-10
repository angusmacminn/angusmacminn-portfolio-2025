import React from 'react';
import "./Contact.css";
import linkedinIcon from '../assets/icons/iconmonstr-linkedin-3.svg';
import githubIcon from '../assets/icons/iconmonstr-github-1.svg';
import instagramIcon from '../assets/icons/iconmonstr-instagram-11.svg';

function Contact({ pageData }) {
  // Check if contactData exists
  if (!pageData) {
    return <div>Contact information not available</div>;
  }

  return (
    <footer className="contact-section" id="contact">
      <h2>{pageData.acf.contact_title}</h2>
      <div className="contact-content">
        <p className="contact-tagline">{pageData.acf.contact_tagline}</p>
        
        <div className="contact-info">
          {pageData.acf.my_email && (
            <div className="contact-item">
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
            aria-label="LinkedIn"
          >
            <img src={linkedinIcon} alt="" />
          </a>
        )}
        
        {pageData.acf.github_url && (
          <a 
            href={pageData.acf.github_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link github"
            aria-label="GitHub"
          >
            <img src={githubIcon} alt="" />
          </a>
        )}
        
        {pageData.acf.instagram_url && (
          <a 
            href={pageData.acf.instagram_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link instagram"
            aria-label="Instagram"
          >
            <img src={instagramIcon} alt="" />
          </a>
        )}
      </div>

      <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Angus MacMinn. All rights reserved.</p>
        </div>


      </div>
      
      
      </footer>
  );
}

export default Contact;