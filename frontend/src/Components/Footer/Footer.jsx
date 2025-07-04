import React from 'react';
import './Footer.css';
import footer_logo from '../Assets/logo_big.png';
import instagram_icon from '../Assets/instagram_icon.png';
import facebook_icon from '../Assets/facebook_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-logo-container'>
        <img src={footer_logo} alt="Logo" className='footer-logo' />
        <p>SHOPS</p>
      </div>
      <div className='footer-columns'>
        <div className='footer-column'>
          <h3>Get To Know Us</h3>
          <ul>
            <li>About Us</li>
            <li>Blogs</li>
            <li>Services</li>
            <li>Products</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div className='footer-column'>
          <h3>Categories</h3>
          <ul>
            <li>Kids</li>
            <li>Men</li>
            <li>Women</li>
          </ul>
        </div>
        <div className='footer-column'>
          <h3>Policies</h3>
          <ul>
            <li>Terms Of Use</li>
            <li>Privacy</li>
            <li>Delivery Policy</li>
            <li>Exchange & Return</li>
          </ul>
        </div>
        <div className='footer-column'>
          <h3>Contact</h3>
          <ul>
            <li>Phone : 123-456-7890</li>
            <li>Address : 123 Main Street, City.</li>
            <li>Email : info@closy.com</li>
          </ul>
          <h3>Social</h3>
          <div className="footer-social-icon">
            <div className="footer-icons-container">
              <img src={instagram_icon} alt="Instagram" />
            </div>
            <div className="footer-icons-container">
              <img src={facebook_icon} alt="Facebook" />
            </div>
            <div className="footer-icons-container">
              <img src={whatsapp_icon} alt="WhatsApp" />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2025 - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;

