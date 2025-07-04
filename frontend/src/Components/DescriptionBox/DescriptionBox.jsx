import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (111)</div>
        </div>
        <div className='descriptionbox-description'>
            <p>An e-commerce website is an online platform that enables the purchase and sale of products or services via the internet. Acting as a virtual marketplace, it allows businesses and individuals to display their offerings, engage with customers, and process transactions without requiring a physical storefront. The convenience, accessibility, and global reach of e-commerce websites have made them increasingly popular.</p>
            <p>E-commerce websites usually showcase products or services with detailed descriptions, images, prices, and available options such as sizes or colors. Each product typically has its own dedicated page providing all relevant information.</p>
        </div>
    </div>
  )
}

export default DescriptionBox