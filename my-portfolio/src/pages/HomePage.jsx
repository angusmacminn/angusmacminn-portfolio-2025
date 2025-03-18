import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import Works from '../components/Works';
import HeroContent from '../components/Hero';
import Contact from '../components/Contact';
import About from '../components/About';
import Header from '../components/Header';
import DotDisplace from '../scripts/DotDisplace';
import './HomePage.css';

function HomePage() {
    const restPath = RestBase + 'pages/5?_nocache=1';
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
        <DotDisplace />
          {!isLoaded ? (
            <p>Loading...</p>
          ) : (
            <>
            <div className="content-wrapper">
              
                <Header />
                <HeroContent pageData={restData} />
                <section className="work-section" id="work">
                  {restData.acf && <h2>{restData.acf.work_title}</h2>}
                  <Works />
                </section>
                {restData?.acf && (<About pageData={restData} />)}
                {restData?.acf && (<Contact pageData={restData} />)}
            </div>

            
            </>

          )}
        </>
    )
}

export default HomePage;
