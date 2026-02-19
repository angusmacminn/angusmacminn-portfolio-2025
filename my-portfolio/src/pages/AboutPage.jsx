import { useState, useEffect, useRef } from 'react';
import { RestBase } from '../utils/RestBase';
import ProfileSkills from '../components/ProfileSkills';
import linkedinIcon from '../assets/icons/iconmonstr-linkedin-3.svg';
import githubIcon from '../assets/icons/iconmonstr-github-1.svg';
import instagramIcon from '../assets/icons/iconmonstr-instagram-11.svg';
import globeIcon from '../assets/icons/globe.svg';
import "./AboutPage.css";
import Contact from '../components/Contact';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

function AboutPage() {
    const aboutPagePath = RestBase + 'pages/9?_embed&_nocache=1'; // Data for "About" page
    const contactPagePath = RestBase + 'pages/5?_embed&_nocache=1'; // Data for "Homepage/Contact" (page ID 5)

    const [aboutPageData, setAboutPageData] = useState(null); // State for About page data
    const [contactPageData, setContactPageData] = useState(null); // State for Contact page data
    
    const [skills, setSkills] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    
    const [isLoaded, setIsLoaded] = useState(false); // Combined loading state for core page data
    const [skillsLoaded, setSkillsLoaded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const [currentTimePST, setCurrentTimePST] = useState('');

    // Fetch core page data (About and Contact/Homepage)
    useEffect(() => {
        const fetchCoreData = async () => {
            setIsLoaded(false);
            setFetchError(null);
            try {
                // Fetch both page data in parallel
                const [aboutResponse, contactResponse] = await Promise.all([
                    fetch(aboutPagePath),
                    fetch(contactPagePath)
                ]);

                if (!aboutResponse.ok) {
                    throw new Error(`Failed to fetch About page data: ${aboutResponse.status}`);
                }
                if (!contactResponse.ok) {
                    throw new Error(`Failed to fetch Contact page data: ${contactResponse.status}`);
                }

                const aboutData = await aboutResponse.json();
                const contactData = await contactResponse.json();

                setAboutPageData(aboutData);
                setContactPageData(contactData);
                
                // Fetch profile image if ACF data for About page exists
                if (aboutData.acf && aboutData.acf.profile_image) {
                    fetchProfileImage(aboutData.acf.profile_image);
                } else {
                    setImageLoaded(true); // No image to load
                }

            } catch (error) {
                console.error("Error fetching core page data:", error);
                setFetchError(error.message);
                setImageLoaded(true); // Ensure image loading doesn't hang
            } finally {
                setIsLoaded(true); // Set loaded to true after attempts, error or success
            }
        };
        
        fetchCoreData();
    }, [aboutPagePath, contactPagePath]); // Dependencies

    // Fetch profile image data
    const fetchProfileImage = async (imageId) => {
        try {
            
            const response = await fetch(`${RestBase}media/${imageId}`);
            
            if (response.ok) {
                const imageData = await response.json();
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

    // Fetch skills once About page data is loaded (or could be independent)
    useEffect(() => {
        if (aboutPageData) { // Or if isLoaded is true and aboutPageData exists
            fetchAllSkills();
        }
    }, [aboutPageData]); // Depends on aboutPageData

    // Function to fetch all skills
    const fetchAllSkills = async () => {
        try {
            // console.log("Fetching skills...");
            setSkillsLoaded(false);
            const response = await fetch(`${RestBase}skills?per_page=100`);
            if (response.ok) {
                const allSkillsData = await response.json();
                setSkills(allSkillsData);
            } else {
                console.error("Failed to fetch skills:", response.status);
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setSkillsLoaded(true);
        }
    };

    // Effect to update the time every second
    useEffect(() => {
        // Function to get and format the current time in PST/PDT
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                timeZone: 'America/Los_Angeles', // Handles PST/PDT automatically
                hour: 'numeric',
                minute: '2-digit',
                // timeZoneName: 'short' // Optional: adds PST/PDT abbreviation
            });
            setCurrentTimePST(timeString + " PST"); // Add PST manually if timeZoneName isn't used or desired
        };

        updateTime(); // Initial update immediately on mount

        // Set up an interval to update the time every second
        const intervalId = setInterval(updateTime, 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);

    }, []); // Empty dependency array ensures this effect runs only once on mount

    // GSAP animation - H1
    useEffect(() => {
        if(aboutPageData?.acf?.tagline){
            gsap.fromTo('.about-intro h1', 
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: 'power2.inOut', delay: 0.3, clearProps: 'x,opacity' }
            );
        }
    }, [aboutPageData?.acf?.tagline]);

    // GSAP animation - bio
    useEffect(() => {
        if(aboutPageData?.acf?.profile_bio_1){
            gsap.fromTo('.about-page-content > *', 
                { opacity: 0, x: -100 },
                { opacity: 1, x: 0, duration: 1, ease: 'power2.inOut', delay: 0.5, clearProps: 'x,opacity', stagger: 0.3 }
            );
        }
    }, [aboutPageData?.acf?.profile_bio_1]);

    useEffect(() => {
        if(aboutPageData?.acf?.profile_bio_2){
            gsap.fromTo('.right-column > *', 
                { opacity: 0, x: 100 },
                { opacity: 1, x: 0, duration: 1, ease: 'power2.inOut', delay: 0.5, clearProps: 'x,opacity', stagger: 0.3 }
            );
        }
    }, [aboutPageData?.acf?.profile_bio_2]);

    useEffect(() => {
        if(aboutPageData?.acf?.profile_bio_1){
            gsap.fromTo('.about-content-2', 
                { opacity: 0, x: -100 },
                { opacity: 1, x: 0, duration: 1, ease: 'power2.inOut', delay: 0.7, clearProps: 'x,opacity', stagger: 0.3 }
            );
        }
    }, [aboutPageData?.acf?.profile_bio_1]);

    // Conditional rendering based on loading and error states
    if (!isLoaded && !fetchError) { // Show loading only if no error yet and not loaded
        // return <p className="loading">Loading page content...</p>;
        return null;
    }
    if (fetchError) {
        return <p className="error">Error: {fetchError}. Please try refreshing the page.</p>;
    }
    if (!aboutPageData || !contactPageData) { // If loaded but data is missing (e.g., one fetch failed but not caught by fetchError)
        return <p className="loading">Page content could not be fully loaded. Please try refreshing.</p>;
    }

    return (
        <>
            <main className="about-page">
                <section className="about-page-section">
                    <div className="about-intro">
                        <h1>About Angus</h1> 
                    </div>
                    <div className="about-page-content-container">
                        <div className="left-column">
                            <div className="about-page-content">
                                {aboutPageData.acf?.profile_bio_1 && <p>{aboutPageData.acf.profile_bio_1}</p>}
                                <div className="skills-container">
                                    {!skillsLoaded ? (
                                        <p className="loading">Loading skills... <span className="loading-dots"></span></p>
                                    ) : skills.length > 0 ? (
                                        <ProfileSkills skillsData={skills} className="skill-tag--about" />
                                    ) : (
                                        <p className="no-skills">No skills found.</p>
                                    )}
                                </div>
                            </div>
    
                            <div className='about-content-2'>
                                <div className='profile-bio-2'>
                                    {aboutPageData.acf?.profile_bio_2 && <p>{aboutPageData.acf.profile_bio_2}</p>}
                                </div>
                            </div>
                        </div>
                        <div className='right-column'>
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
                            
                            <div className="education-section">
                                <h3>Education</h3>
                                <div className="education-item">
                                    <p>Bachelors of Digital Communications</p>
                                    <p className="education-school">Humber College - 2021</p>
                                </div>
                                <div className="education-item">
                                    <p>Certificate in Front-End Web Development</p>
                                    <p className="education-school">British Columbia Institute of Technology - 2025</p>
                                </div>
                            </div>

                            <div className="about-contact-section">
                                <div className="contact-info location-info">
                                    <img src={globeIcon} alt="location" className="globe-icon" />
                                    Vancouver, BC
                                </div>
                                <div className="contact-item">
                                    <div className="contact-info time-info">
                                        <motion.span 
                                            className="time-indicator"
                                            animate={{ 
                                                opacity: [1, 0.3, 1],
                                                scale: [1, 0.8, 1]
                                            }}
                                            transition={{ 
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        {currentTimePST}
                                    </div>
                                </div>
                                <div className="contact-info">
                                    {aboutPageData.acf?.contact_email && 
                                        <a href={`mailto:${aboutPageData.acf.contact_email}`}>{aboutPageData.acf.contact_email}</a>
                                    }
                                </div>
                                <div className="social-links">
                                    {aboutPageData.acf?.instagram_url && (
                                        <a href={aboutPageData.acf.instagram_url} target="_blank" rel="noopener noreferrer">
                                            <img src={instagramIcon} alt="Instagram" />
                                        </a>
                                    )}
                                    {aboutPageData.acf?.github_url && (
                                        <a href={aboutPageData.acf.github_url} target="_blank" rel="noopener noreferrer">
                                            <img src={githubIcon} alt="GitHub" />
                                        </a>
                                    )}
                                    {aboutPageData.acf?.linkedin_url && (
                                        <a href={aboutPageData.acf.linkedin_url} target="_blank" rel="noopener noreferrer">
                                            <img src={linkedinIcon} alt="LinkedIn" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Contact pageData={contactPageData}/>
        </>
    );
}

export default AboutPage;
