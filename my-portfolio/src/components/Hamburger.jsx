import Hamburger from 'hamburger-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Hamburger.css';

function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleLinkClick = () => {
        setIsOpen(false);
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
                    color="#631E30"
                />
                        </button>
            
            {isOpen && 
                <nav 
                    id="mobile-navigation" 
                    className="hamburger-menu"
                    aria-label="Mobile Navigation"
                >
                    <ul>
                        <li><NavLink onClick={handleLinkClick} to="/">Home</NavLink></li>
                        <li><NavLink onClick={handleLinkClick} to="/work">Work</NavLink></li>
                        <li><NavLink onClick={handleLinkClick} to="/about">About</NavLink></li>
                        <li><NavLink onClick={handleLinkClick} to="/contact">Contact</NavLink></li>
                        <li><NavLink onClick={handleLinkClick} to="/experiments">Experiments</NavLink></li>
                        
                    </ul>
                </nav>
            }
        </div>
    )
}

export default HamburgerMenu;