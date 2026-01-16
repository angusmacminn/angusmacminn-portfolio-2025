import Hamburger from 'hamburger-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Hamburger.css';

function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 300); // This should match your animation duration
    };

    const handleLinkClick = () => {
        setIsOpen(false);
        handleClose();
    };

    return (
        <div>
            <button 
                className="hamburger-container"
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                aria-label="Menu"
            >
                <Hamburger 
                    toggled={isOpen} 
                    toggle={setIsOpen}
                    color="white"
                    distance="4"
                    duration={0.3}
                />
            </button>
            
            {(isOpen || isClosing) &&  
            <nav 
                id="mobile-navigation" 
                className="hamburger-menu"
                aria-label="Mobile Navigation"
            >
                <ul>
                    <li><NavLink onClick={handleLinkClick} to="/">Home</NavLink></li>
                    <li><HashLink onClick={handleLinkClick} smooth to="/#work">Work</HashLink></li>
                    <li><NavLink onClick={handleLinkClick} to="/about">About</NavLink></li>
                    <li><NavLink onClick={handleLinkClick} to="/services">Services</NavLink></li>
                    <li><NavLink onClick={handleLinkClick} to="/playground">Playground</NavLink></li>
                    <li><NavLink onClick={handleLinkClick} to="/archive">Archive</NavLink></li>
                </ul>
            </nav>
        }
    </div>
)
}

export default HamburgerMenu;