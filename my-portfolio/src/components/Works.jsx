import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import { Link } from 'react-router-dom';
import "./Works.css";

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
              <div key={work.id} className="work-card">
                 <Link to={`/work/${work.slug}`} className="work-link">
                    <h3>{work.title.rendered}</h3>
                    </Link>   
                
                    <div className="skills">
                      {work.class_list
                        .filter(className => className.startsWith('skills-'))
                        .map(skill => (
                          <span key={skill} className="skill-tag">
                            {skill.replace('skills-', '').replace('-', ' ')}
                          </span>
                        ))}
                    </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Works;