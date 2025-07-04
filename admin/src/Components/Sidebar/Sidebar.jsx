import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../../assets/add_product.svg';
import list_product_icon from '../../assets/list_product.svg';
import userlist from '../../assets/user_list.svg';

const Sidebar = () => {

  return (
    <div className='sidebar'>
      <div className="sidebar-content">
        <Link to={'/userlist'} style={{ textDecoration: 'none' }}>
          <div className="sidebar-item">
            <img className="user-list-img" src={userlist} alt="" />
            <p>ALL USER LIST</p>
          </div>
        </Link>
        <Link to={'/listproduct'} style={{ textDecoration: 'none' }}>
          <div className="sidebar-item">
            <img className="list-product-img" src={list_product_icon} alt="" />
            <p>PRODUCT LIST</p>
          </div>
        </Link>
        <Link to={'/addproduct'} style={{ textDecoration: 'none' }}>
          <div className="sidebar-item">
            <img className="add-item-img" src={add_product_icon} alt="" />
            <p>ADD PRODUCT</p>
          </div>
        </Link>
        <Link to={'/promocode'} style={{ textDecoration: 'none' }}>
          <div className="sidebar-item">
            <img className="add-item-img" src={add_product_icon} alt="" />
            <p>PROMOCODE</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;