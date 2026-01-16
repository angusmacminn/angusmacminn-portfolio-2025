import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { gsap } from 'gsap';
import arrow from '../assets/icons/project-arrow.svg';
import './Services.css';

function Services() {
    useEffect(() => {
        gsap.fromTo('.services-header, .services-hero, .services-description, .services-cta-section, .why-work-with-me, .is-this-you, .what-i-offer, .selected-work, .services-contact-section', {
            opacity: 0,
            y: -30,
        }, {
            opacity: 1, 
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            delay: 0.2,
            stagger: 0.15,
        });
    }, []);

    return (
        <>
            <Header />
            <section className="services-section">
                <div className="services-container">
                    <div className="services-header">
                        <p className="services-subtitle">Web Design & Development Services</p>
                    </div>

                    <div className="services-hero">
                        <h1>Design-led websites that feel modern, perform well, and are easy to update.</h1>
                    </div>

                    <div className="services-description">
                        <p>I help small teams and businesses build fast, accessible websites with thoughtful motion and interactivity. No large agency overhead, just focused work on what matters.</p>
                        <p>Whether you need a new site or want to rebuild an existing one, my focus is always on clarity, usability, and making sure it's easy to maintain down the road.</p>
                    </div>

                    <div className="services-cta-section">
                        <a href="#contact" className="services-cta-button">Say Hi!</a>
                    </div>

                    <div className="why-work-with-me">
                        <h2>Why work with me</h2>
                        <p>I'm a creative developer with a background in design, motion, and digital communications. I build sites that feel polished and perform well, but just as importantly, they're structured so you can actually maintain them without constant developer help.</p>
                    </div>

                    {/* <div className="is-this-you">
                        <h2>Is this you?</h2>
                        <ul>
                            <li>Your current website looks outdated or doesn't reflect your brand</li>
                            <li>You want something modern and interactive, but not over-designed or gimmicky</li>
                            <li>You need to update content internally without breaking the site</li>
                            <li>You've worked with templates before and want something more tailored</li>
                            <li>You want a developer who also understands design, motion, and UX</li>
                        </ul>
                        <p className="closing-text">If any of that sounds familiar, I can help.</p>
                    </div> */}

                    <div className="what-i-offer">
                        <h2>What I offer</h2>
                        <div className="services-grid">
                            <div className="service-card">
                                <h3>Custom Website Design & Development</h3>
                                <p className="card-intro">I design and build custom websites tailored to your goals, not generic templates.</p>
                                <div className="service-badges">
                                    <span className="service-badge">Marketing & Brand Sites</span>
                                    <span className="service-badge">Portfolio & Content-Driven</span>
                                    <span className="service-badge">Small Business & Professional Services</span>
                                    <span className="service-badge">Landing Pages</span>
                                </div>
                                <p className="card-footer">Every site is built to be fast, responsive, and accessible on any device.</p>
                            </div>

                            <div className="service-card">
                                <h3>CMS-Driven Builds</h3>
                                <p className="card-intro">You shouldn't need a developer every time you want to update text.</p>
                                <p className="card-description">I set up a flexible CMS so you can:</p>
                                <div className="service-badges">
                                    <span className="service-badge">Edit Text & Images</span>
                                    <span className="service-badge">Add New Pages</span>
                                    <span className="service-badge">Manage Team Members</span>
                                    <span className="service-badge">Update Projects & Portfolio</span>
                                    <span className="service-badge">Publish Blog Content</span>
                                </div>
                                <p className="card-footer">I'll walk you through everything after launch so you feel confident making updates on your own.</p>
                            </div>

                            <div className="service-card">
                                <h3>Motion & Interactive Elements</h3>
                                <p className="card-intro">When used intentionally, motion guides users and makes a site feel polished.</p>
                                <p className="card-description">This can include:</p>
                                <div className="service-badges">
                                    <span className="service-badge">Subtle Hover Animations</span>
                                    <span className="service-badge">Scroll Animations</span>
                                    <span className="service-badge">Page Transitions</span>
                                    <span className="service-badge">Interactive Sections</span>
                                    <span className="service-badge">Visual Highlights</span>
                                </div>
                                <p className="card-footer">Everything is designed with performance and accessibility in mind.</p>
                            </div>

                            <div className="service-card">
                                <h3>Performance, Accessibility & SEO Basics</h3>
                                <p className="card-intro">Behind the scenes, I make sure your site is built the right way.</p>
                                <div className="service-badges">
                                    <span className="service-badge">Optimized Loading & Performance</span>
                                    <span className="service-badge">Mobile-Friendly Structure</span>
                                    <span className="service-badge">Accessible Design</span>
                                    <span className="service-badge">Clean Semantic Markup</span>
                                    <span className="service-badge">SEO Essentials</span>
                                    <span className="service-badge">Analytics Setup</span>
                                </div>
                                <p className="card-footer">These aren't extras, they're just part of how I build.</p>
                            </div>
                        </div>
                    </div>

                    <div className="selected-work">
                        <h2>Selected work</h2>
                        <div className="selected-work-grid">
                            <Link to="/work/dova-health" className="selected-work-card">
                                <div className="selected-work-content">
                                    <h3>Dova Health Intelligence</h3>
                                    <p className="project-role">Healthcare marketing site · UX, CMS, Motion</p>
                                    <p>Redesigned and developed a healthcare website focused on clarity and trust. Added subtle motion and interactive elements to help users navigate complex health information more easily.</p>
                                </div>
                                <div className="view-case-study">
                                    <span>View case study</span>
                                    <img src={arrow} alt="arrow" />
                                </div>
                            </Link>

                            <Link to="/work/affirming-therapy" className="selected-work-card">
                                <div className="selected-work-content">
                                    <h3>Affirming Therapy</h3>
                                    <p className="project-role">Accessible informational site · Design, Development, UX</p>
                                    <p>Built a calm, accessible informational site that prioritizes clarity and trust. Focused on creating an approachable experience that helps potential clients feel comfortable reaching out.</p>
                                </div>
                                <div className="view-case-study">
                                    <span>View case study</span>
                                    <img src={arrow} alt="arrow" />
                                </div>
                            </Link>

                            <Link to="/work/skye-interactive" className="selected-work-card">
                                <div className="selected-work-content">
                                    <h3>Skye Interactive (Studio Site)</h3>
                                    <p className="project-role">Interactive studio site · Motion, WebGL, Design</p>
                                    <p>A design-forward studio site that explores motion, layout, and interactivity. Built with performance and structure in mind so it works well for real client projects, not just as a showpiece.</p>
                                </div>
                                <div className="view-case-study">
                                    <span>View case study</span>
                                    <img src={arrow} alt="arrow" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="services-contact-section">
                        <h2>Let's talk about your project</h2>
                        <p className="services-contact-intro">If you're planning a new website or want to improve an existing one, let's chat through your ideas and see if we're a good fit.</p>
                        
                        <div className="services-contact-process">
                            <h3>What happens next:</h3>
                            <div className="services-process-steps">
                                <p>Short intro call to understand your goals</p>
                                <p>Quick discussion around scope and timeline</p>
                                <p>Clear next steps if it makes sense to move forward</p>
                            </div>
                        </div>

                        <div className="services-contact-ctas">
                            <a href="https://calendly.com/angusmacminn/30min" target="_blank" rel="noopener noreferrer" className="services-contact-cta primary">Book a free intro call</a>
                            <a href="mailto:angusmacminn@outlook.com" className="services-contact-cta secondary">Tell me about your project</a>
                        </div>

                        <div className="services-contact-info">
                            <p className="services-email-line">angusmacminn@outlook.com</p>
                            <p className="services-location-line">Based in Vancouver · Working with clients remotely</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Services;
