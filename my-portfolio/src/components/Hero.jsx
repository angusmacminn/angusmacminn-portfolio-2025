import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';

function HeroContent() {
  const [pageData, setPageData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('https://angusmacminn.com/portfolio-backend/wp-json/wp/v2/pages/5');
        if (response.ok) {
          const data = await response.json();
          console.log('Hero data received:', data); // Debug log
          setPageData(data);
        } else {
          console.error('Failed to fetch hero data');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchHeroData();
  }, []);
  
  // Don't render anything until data is loaded
  if (!isLoaded) {
    return <div>Loading hero...</div>;
  }
  
  // Check if pageData exists before trying to access acf
  if (!pageData) {
    return <div>No page data available</div>;
  }
  
  // Now it's safe to access pageData.acf
  return (
    <div className="hero">
      <h1>{pageData.acf.name}</h1>
      <h2>{pageData.acf.position_title}</h2>

      {/* Other content using ACF fields */}
    </div>
  );
}

export default HeroContent;