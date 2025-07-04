import React from 'react';
import { Link } from 'react-router-dom';
import './Item.css';

const Item = (props) => {
  return (
    <div className='item'>
      <Link to={`/product/${props.id}`}><img src={props.image} alt="" onClick={() => window.scrollTo(0, 0)} /></Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className='item-price-new'>
          ₹{props.new_price}
        </div>
      </div>
      {props.available === false && <p className="out-of-stock-label">Out of Stock</p>}
    </div>
  )
}

export default Item
