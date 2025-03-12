import { NavLink } from 'react-router-dom';
import HamburgerMenu from './Hamburger';
function Header() {
    return (
        <header>
            <nav className="header-nav">
                <div className="nav-content">
                    <div className="mobile-nav">
                            <HamburgerMenu />
                    </div>
                    <div className="logo">
                            <img src="/path-to-your-logo.png" alt="Angus MacMinn logo" />
                    </div>
                    <div className="desktop-nav">
                        <ul>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/work">Work</NavLink></li>
                            <li><NavLink to="/about">About</NavLink></li>
                            <li><NavLink to="/contact">Contact</NavLink></li>
                        </ul>
                    </div>
                </div>
            </nav>
            
        </header>
    )
}

export default Header;
