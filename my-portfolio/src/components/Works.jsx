import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import { Link } from 'react-router-dom';
import "./Works.css";
import arrow from "../assets/icons/project-arrow.svg"

function Works() {
    const restPath = RestBase + 'work';
    const [works, setWorks] = useState([]);
    const [isLoaded, setLoadStatus] = useState(false);

    useEffect(() => {
        // Reset loading state when fetching
        setLoadStatus(false);
        
        const fetchWorks = async () => {
          try {
            // Add cache-busting parameter to prevent browser caching
            const response = await fetch(`${restPath}?timestamp=${new Date().getTime()}`);
            if (response.ok) {
              const data = await response.json();
              // console.log('Fetched works:', data); // Debug log
              setWorks(data);
              setLoadStatus(true);
            } else {
              console.error('Error response:', response.status);
              setLoadStatus(false);
            }
          } catch (error) {
            console.error('Error fetching works:', error);
            setLoadStatus(false);
          }
        };
        
        fetchWorks();
    }, [restPath]);
    
    return (
      <div className="works">
      {!isLoaded ? (<p>Loading works...</p>) : (
        <div className="works-cards">
          {works.length === 0 ? (
            <p>No works found</p>
          ) : (
            works.map(work => (
              <Link to={`/work/${work.slug}`} className="work-card" key={work.id}>
                <div className="title-container">
                  <h3>{work.title.rendered}</h3>
                  <img src={arrow} alt="arrow" />
                </div>
                <div className="skills">
                  {work.class_list
                    .filter(className => className.startsWith('skills-'))
                    .map(skill => (
                      <span key={skill} className="skill-tag">
                        {skill.replace('skills-', '').replace('-', ' ')}
                      </span>
                    ))}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Works;