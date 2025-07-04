import React from 'react';
import './CSS/PaymentSuccess.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'; 

const PaymentSuccess = () => {
  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
        <h2>Payment Successful!</h2>
        <p>Your order has been placed successfully.</p>
        <p>You will receive an email confirmation shortly with order details.</p>
        <Link to="/" className="back-to-home-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;