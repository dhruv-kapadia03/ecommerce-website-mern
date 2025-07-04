import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext.jsx';
import remove_icon from '../Assets/cart_cross_icon.png';
import empty_cart from '../Assets/empty-cart.svg';

const CartItems = () => {
  const { all_product, getTotalCartAmount, cartItems, addToCart, removeFromCart, selectedSizes } = useContext(ShopContext);
  const [promocode, setPromocode] = useState('');
  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [isPromocodeValid, setIsPromocodeValid] = useState(true);
  const navigate = useNavigate();

  const handlePromocodeChange = (event) => {
    setPromocode(event.target.value);
    setIsPromocodeValid(true); // Reset validation on change
    setDiscountedTotal(null); // Clear previous discount
  };

  const applyPromocode = async () => {
    if(promocode) {
      try {
        const response = await fetch("/api/validate-promocode", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({promocode, totalAmount}),
        });
        const data = await response.json();
        if (data.valid) {
          setDiscountedTotal(data.discountedAmount);
          setIsPromocodeValid(true);
        } else {
          setIsPromocodeValid(false);
          setDiscountedTotal(null);
        }
      } catch (error) {
        console.error('Error validating promocode:', error);
        setIsPromocodeValid(false);
        setDiscountedTotal(null);
      }
    }
  }

  const handleCheckoutClick = () => {
    // Pass the final total (with discount if applied) to the checkout page
    navigate('/checkout', { state: { finalTotal: discountedTotal !== null ? discountedTotal : totalAmount } });
  };

  const totalAmount = getTotalCartAmount();
  if (totalAmount === 0) {
    return (
      <div className='cartitems-empty'>
        <div className="empty-cart-icon">
          <img src={empty_cart} alt="Empty Cart" />
        </div>
        <h2>YOUR CART IS EMPTY. LET'S CHANGE THAT!</h2>
        <p>Browse the best products, <a href="/"> start shopping now!</a></p>
      </div>
    );
  }

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Description</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt={e.name} className='carticon-product-icon' />
                <p className='desc'>{e.name} <small>Size: {selectedSizes[e.id] || 'Not selected'}</small> </p>
                <p>₹{e.new_price}</p>
                <div className='cartitems-quantity'>
                  <button onClick={() => removeFromCart(e.id)}>-</button>
                  <span>{cartItems[e.id]}</span>
                  <button onClick={() => addToCart(e.id, selectedSizes[e.id])}>+</button>
                </div>
                <p>₹{e.new_price * cartItems[e.id]}</p>
                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => removeFromCart(e.id)} alt="Remove" />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>CART TOTALS</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>₹{totalAmount}</p>
            </div>
            <hr />
            <div className='cartitems-total-item'>
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            {/* <hr /> */}
            {discountedTotal !== null && (
              <div className='cartitems-total-item'>
                <p>Discount</p>
                <p>- ₹{(totalAmount - discountedTotal).toFixed(2)}</p>
              </div>
            )}
            <hr />
            <div className='cartitems-total-item'>
              <h3>Total</h3>
              {/* <h3>₹{totalAmount}</h3> */}
              <h3>₹{discountedTotal !== null ? discountedTotal.toFixed(2) : totalAmount.toFixed(2)}</h3>
            </div>
          </div>
          <button onClick={handleCheckoutClick}>CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>Have a Promocode?</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='Enter Here' value={promocode} onChange={handlePromocodeChange}/>
            <button onClick={applyPromocode}>Apply</button>
          </div>
          {!isPromocodeValid && <p className="promocode-error">Invalid promocode.</p>}
        </div>
      </div>
    </div>
  );
}

export default CartItems;