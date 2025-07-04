import React, {useContext, useRef, useState} from "react";
import "./Navbar.css";
import allData from "../Assets/db.js";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import nav_dropdown from "../Assets/dropdown_icon1.png";
import {Link} from "react-router-dom";
import {ShopContext} from "../../Context/ShopContext.jsx";

const Navbar = () => {
  const [menu, setMenu] = useState("");
  const {getTotalCartItems} = useContext(ShopContext);
  const menuRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false); 
  const authToken = localStorage.getItem('auth-token'); 
  const userName = localStorage.getItem('userName'); 
  const userEmail = localStorage.getItem('userEmail'); 

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
    } else {
    const filteredProducts = allData.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
      setSearchResults(filteredProducts);
    }
  };

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const toggleUserDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeUserDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-top">
        <div className="nav-logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo-img" />
            <p className="logo-text">CLOSY</p>
          </Link>
        </div>

        <div className="nav-search-wrapper">
          <input
            type="text"
            className="nav-search"
            placeholder="Search Products..."
            onChange={handleSearch}
            value={searchTerm}
          />
          {searchTerm && searchResults.length > 0 && (
            <div className="search-container">
              {searchResults.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  className="search-item"
                  key={product.id}
                  onClick={() => setSearchTerm("")}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="search-img"
                  />
                  <div className="search-details">
                    <p className="search-name">{product.name}</p>
                    <p className="search-price">₹{product.new_price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="nav-actions">
          {!authToken ? ( 
          <Link to="/login" className="login-button">LOGIN</Link>
            ) : ( 
            <div className="user-action">
              <img  
                src="https://img.icons8.com/ios-glyphs/60/user--v1.png" alt="user--v1" 
                className="user-icon" 
                onClick={toggleUserDropdown}
              />
              {dropdownVisible && ( 
                <div className="user-dropdown" onClick={closeUserDropdown}> 
                  <p className="user-details-name">{userName ? userName : "User Name"}</p> 
                  <p className="user-details-email">{userEmail ? userEmail : "user@example.com"}</p> 
                  <Link to="/UserProfile" className="user-link"><p className="user-profile">My Profile</p></Link>
                  <button className="logout-button" onClick={() => {
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail'); 
                    window.location.replace('/');
                  }}>LOGOUT</button>
                </div>
              )}
            </div>
          )}
          <Link to="/cart" className="cart-link">
            <img src={cart_icon} alt="Cart" className="cart-icon" />
            <span className="nav-cart-count">{getTotalCartItems()}</span>
          </Link>
        </div>
      </div>

      <div className="navbar-bottom">
        <img
          className="nav-dropdown"
          onClick={dropdown_toggle}
          src={nav_dropdown}
          alt="Menu"
        />
        <ul ref={menuRef} className="nav-menu">
          <li onClick={() => setMenu("shop")} className="nav-menu-item">
            <Link to="/">SHOP</Link>
            {menu === "shop" ? <hr className="menu-indicator" /> : null}
          </li>
          <li onClick={() => setMenu("kids")} className="nav-menu-item">
            <Link to="/kids">KIDS</Link>
            {menu === "kids" ? <hr className="menu-indicator" /> : null}
          </li>
          <li onClick={() => setMenu("womens")} className="nav-menu-item">
            <Link to="/womens">WOMEN</Link>
            {menu === "womens" ? <hr className="menu-indicator" /> : null}
          </li>
          <li onClick={() => setMenu("mens")} className="nav-menu-item">
            <Link to="/mens">MEN</Link>
            {menu === "mens" ? <hr className="menu-indicator" /> : null}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;



