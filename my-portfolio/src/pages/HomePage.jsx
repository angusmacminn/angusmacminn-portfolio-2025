import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            <a href="#main-content" className="skip-to-content">Skip to content</a>
            
            <div className='canvas-wrapper'>
              <DotDisplace />
            </div>
            
            {!isLoaded ? (
                <p>Loading...</p>
            ) : (
                <>
                <div className="content-wrapper">
                    <Header />
                    
                    <main id="main-content">
                        <HeroContent pageData={restData} />
                        {restData?.acf && (<About pageData={restData} />)}
                        <section className="work-section" id="work">
                            {restData.acf && <h2>{restData.acf.work_title}</h2>}
                            <Works />
                            <div className="experiments-button-container">
                                <Link to="/experiments" className="experiments-button">
                                    Experiments
                                </Link>
                            </div>
                        </section>
                        
                        {restData?.acf && (<Contact pageData={restData} />)}
                    </main>
                </div>
                </>
            )}
        </>
    )
}

export default HomePage;
