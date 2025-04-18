import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';
import logo from '../../assets/title.png';
import { useUserLogin } from '../contexts/UserLoginContext';

function Header() {
    const { currentUser, logoutUser } = useUserLogin();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const logout = () => {
        logoutUser();
        setMenuOpen(false); // Close menu on logout
    };

    return (
        <header className="header">
            <Link to="/">
                <img className="pic" src={logo} alt="Logo" />
            </Link>

            <div className="menu-icon" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>

            <nav className={`links ${menuOpen ? 'open' : ''}`}>
                {!currentUser && (
                    <>
                        <NavLink to="/about" className="nav-link" onClick={toggleMenu}>About</NavLink>
                        <NavLink to="/login" className="nav-link" onClick={toggleMenu}>Sign In</NavLink>
                        <NavLink to="/signup" className="nav-link" onClick={toggleMenu}>Sign Up</NavLink>
                    </>
                )}

                {currentUser && (
                    <>
                        <NavLink to="/category" className="nav-link" onClick={toggleMenu}>Category</NavLink>
                        <NavLink to="/profile" className="nav-link" onClick={toggleMenu}>Profile</NavLink>
                        <NavLink to="/report" className="nav-link" onClick={toggleMenu}>Report</NavLink>
                        <span className="welcome-msg">Hi, {currentUser.name}!</span>
                        <button className="nav-link logout-btn" onClick={logout}>Sign Out</button>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
