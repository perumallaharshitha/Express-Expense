import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/title.png';
import UserContext from '../../context/UserContext'; 

function Header() {
    const { user, setUser } = useContext(UserContext);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <div className="header">
            <Link to="/">
                <img className="pic" src={logo} alt="Logo" />
            </Link>
            <div className="links">
                {!user && <Link to="/about" className="nav-link">About</Link>}
                {user && (
                    <>
                        <Link to="/category" className="nav-link">Category</Link>
                        <Link to="/profile" 
                        className="nav-link">Profile</Link>
                        <Link to="/report" className="nav-link">Report</Link>
                    </>
                )}
                {!user ? (
                    <>
                        <Link to="/login" className="nav-link">Sign In</Link>
                        <Link to="/signup" className="nav-link">Sign Up</Link>
                    </>
                ) : (
                    <button onClick={logout} className="nav-link">Sign Out</button>
                )}
            </div>
        </div>
    );
}

export default Header;
