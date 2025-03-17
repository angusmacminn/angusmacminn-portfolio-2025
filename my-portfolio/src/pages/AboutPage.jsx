import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { RestBase } from '../utils/RestBase';
import ProfileSkills from '../components/ProfileSkills';


function AboutPage() {
    const restPath = RestBase + 'pages/9?_nocache=1';
    const [restData, setData] = useState(null);
    const [skills, setSkills] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [isLoaded, setLoadStatus] = useState(false);
    const [skillsLoaded, setSkillsLoaded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Fetch page data first
    useEffect(() => {
        const fetchData = async () => {
            try {
                const pageResponse = await fetch(restPath);
                if (pageResponse.ok) {
                    const data = await pageResponse.json();
                    console.log("Page data loaded:", data);
                    setData(data);
                    setLoadStatus(true);

                    if (data.acf && data.acf.profile_image) {
                        fetchProfileImage(data.acf.profile_image);
                    } else {
                        setImageLoaded(true);
                    }
 

                } else {
                    console.error("Failed to fetch page data:", pageResponse.status);
                    setImageLoaded(true);
                    setLoadStatus(false);
                }
            } catch (error) {
                console.error("Error fetching page data:", error);
                setLoadStatus(false);
                setImageLoaded(true);
            }
        };
        
        fetchData();
    }, [restPath]);

    // Fetch profile image data
    const fetchProfileImage = async (imageId) => {
        try {
            console.log("Fetching profile image with ID:", imageId);
            const response = await fetch(`${RestBase}media/${imageId}`);
            
            if (response.ok) {
                const imageData = await response.json();
                console.log("Image data loaded:", imageData);
                setProfileImage(imageData);
            } else {
                console.error("Failed to fetch image:", response.status);
            }
        } catch (error) {
            console.error("Error fetching image:", error);
        } finally {
            setImageLoaded(true);
        }
    };

    // Then fetch skills once page data is loaded
    useEffect(() => {
        // Only run this effect when restData is available
        if (restData) {
            fetchAllSkills();
        }
    }, [restData]);

    // Function to fetch all skills
    const fetchAllSkills = async () => {
        try {
            console.log("Fetching skills...");
            setSkillsLoaded(false); // Reset loading state
            
            // Fetch all skills with a high per_page value
            const response = await fetch(`${RestBase}skills?per_page=100`);
            if (response.ok) {
                const allSkills = await response.json();
                console.log("Skills loaded:", allSkills.length);

                // store all skills in skills state
                setSkills(allSkills);
            } else {
                console.error("Failed to fetch skills:", response.status);
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setSkillsLoaded(true);
        }
    };

    return (
        <>
            <Header/>
            <main className="about-page">
                {!isLoaded ? (
                    <p className="loading">Loading page content...</p> 
                ) : (
                    <section className="about">
                        <div className="about-intro">
                            <h1>{restData.acf.tagline}</h1>
                            <p>{restData.acf.profile_bio_1}</p>
                        </div>
                        
                        <div className="about-content">
                            <div className="skills-container">
                                {!skillsLoaded ? (
                                    <p className="loading">Loading skills... <span className="loading-dots"></span></p>
                                ) : skills.length > 0 ? (
                                    <>
                                        <ProfileSkills skillsData={skills} />
                                    </>
                                ) : (
                                    <p className="no-skills">No skills found. Please check your API endpoint.</p>
                                )}
                            </div>

                            <div className='profile-bio-2'>
                                <p>{restData.acf.profile_bio_2}</p>
                            </div>
                        </div>

                        <div className='about-content-2'>
                        <div className='profile-image'>
                                {!imageLoaded ? (
                                    <p className="loading">Loading image...</p>
                                ) : profileImage ? (
                                    <img 
                                        src={profileImage.source_url} 
                                        alt={profileImage.alt_text || 'Profile image'} 
                                    />
                                ) : (
                                    <p>No profile image available</p>
                                )}
                            </div>
                        </div>
                        


                    </section>
                )}
            </main>
        </>
    )
}

export default AboutPage;
