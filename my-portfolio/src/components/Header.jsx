import { NavLink } from 'react-router-dom';
import { HashLink} from 'react-router-hash-link';
import HamburgerMenu from './Hamburger';
import angusLogo from '../assets/icons/angus-logo-1.svg'; // Update path if needed
import "./Header.css";

function Header() {
    return (
        <header>
            <nav className="header-nav" aria-label="Main Navigation">
                <div className="nav-content">
                    <div className="logo">
                        <NavLink to="/">
                            <img src={angusLogo} alt="Angus MacMinn Logo" className="logo-white" />
                        </NavLink>
                    </div>
                    <div className="desktop-nav">
                        <ul>
                            <li><HashLink smooth to="/#work">Work</HashLink></li>
                            <li><NavLink to="/about">About</NavLink></li>
                            <li><HashLink smooth to="/#contact">Contact</HashLink></li>
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
