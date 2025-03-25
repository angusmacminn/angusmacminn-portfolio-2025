import { NavLink } from 'react-router-dom';
import HamburgerMenu from './Hamburger';
import "./Header.css";

function Header() {
    return (
        <header>
            <nav className="header-nav">
                <div className="nav-content">
                    <div className="logo">
                            
                    </div>
                    <div className="desktop-nav">
                        <ul>
                            
                            <li><NavLink to="/work">Work</NavLink></li>
                            <li><NavLink to="/about">About</NavLink></li>
                            <li><NavLink to="/contact">Contact</NavLink></li>
                            <li><NavLink to="/experiments">Experiments</NavLink></li>
                        </ul>
                    </div>
                    <div className="mobile-nav">
                            <HamburgerMenu />
                    </div>
                </div>
            </nav>
            
        </header>
    )
}

export default Header;
