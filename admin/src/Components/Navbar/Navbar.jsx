import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
// import navProfile from '../../assets/nav_profile.png';
import { Link } from "react-router-dom"; 

const Navbar = () => {

    const handleLogout = () => {
        localStorage.removeItem('auth-token'); 
        localStorage.removeItem('isAdmin');   
        window.location.href = 'http://localhost:5173/'; 
    };

    return (
        <div className="navbar">
            <div className="navbar-content">
                <Link to="/userlist" className="logo">
                    <img src={logo} alt="Logo" className="logo-img" />
                    <p className="logo-text">CLOSY</p>
                </Link>
                <div className="user-actions">
                    <button className="button" onClick={handleLogout}>LOGOUT</button> 
                    {/* <img src={navProfile} className="user-icon" alt="User" /> */}
                </div>
            </div>
        </div>
    );
}

export default Navbar;