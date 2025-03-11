import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import Works from '../components/Works';
import HeroContent from '../components/Hero';

function HomePage() {
    const restPath = RestBase + 'pages/5';
    const [restData, setData] = useState([]);
    const [isLoaded, setLoadStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch(restPath)
        if ( response.ok ) {
            const data = await response.json()
            setData(data)
            setLoadStatus(true)
        } else {
            setLoadStatus(false)
        }
    }
    fetchData()
}, [restPath])
    return (
        <>
          {!isLoaded ? (
            <p>Loading...</p>
          ) : (
            <>
              <HeroContent />
              <Works />
            </>

          )}
        </>
    )
}

export default HomePage;
