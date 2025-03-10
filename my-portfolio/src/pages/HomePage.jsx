import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import Works from '../components/Works';

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
              <h1>{restData.title.rendered}</h1>
              <div dangerouslySetInnerHTML={{ __html: restData.content.rendered }} />
              <Works />
            </>

          )}
        </>
    )
}

export default HomePage;
