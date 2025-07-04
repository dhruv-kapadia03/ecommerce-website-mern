import React from 'react';
import './CSS/PaymentFailed.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'; 

const PaymentFailed = () => {
  return (
    <div className="payment-failed-container">
      <div className="payment-failed-card">
        <FontAwesomeIcon icon={faTimesCircle} className="success-icon" />
        <h2>Payment Failed</h2>
        <p>We couldn't process your payment.</p>
        <p>Please try again or use a different payment method.</p>
        <Link to="/" className="back-to-home-button">
          Back to Home
        </Link>
        <Link to="/checkout" className="retry-payment-button">
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;