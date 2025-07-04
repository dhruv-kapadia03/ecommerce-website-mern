import React, { useContext, useState, useEffect } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext.jsx';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductDisplay = () => {
  const { productId } = useParams();
  const { all_product, addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (all_product && all_product.length > 0) {
      const foundProduct = all_product.find((p) => p.id === Number(productId));
      setProduct(foundProduct);
    }
  }, [all_product, productId]);

  if (!product) {
    return <div className="product-display-loading">Loading...</div>;
  }

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = ()=> {
    if (product.available) {
      addToCart(product.id, selectedSize)
    } else {
      toast.error("This product is currently out of stock");
    }
  }

  return (
    <div className='productdisplay'>
      <div className='productdisplay-left'>
        <div className='productdisplay-img-list'>
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className='productdisplay-img'>
          <img className='productdisplay-main-img' src={product.image} alt="" />
        </div>
      </div>
      <div className='productdisplay-right'>
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(111)</p>
        </div>
        <div className='productdisplay-right-prices'>
          <div className="productdisplay-right-price-new">₹{product.new_price}</div>
        </div>
        <div className='productdisplay-right-description'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita, consequatur. Animi vero eius ipsa voluptatum, nemo cupiditate dolores nesciunt mollitia!
        </div>
        <div className='productdisplay-right-size'>
          <h1>Select Size</h1>
          <div className='productdisplay-right-sizes'>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <div
                key={size}
                onClick={() => handleSizeClick(size)}
                className={selectedSize === size ? 'selected-size' : ''}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.available} // Disable tbutton if out of stock
          className={!product.available ? "out-of-stock-button-disabled" : ""}
        >
          {product.available ? "ADD TO CART" : "OUT OF STOCK"}
        </button>
      </div>
    </div>
  )
}

export default ProductDisplay

//  {/* <p className='productdisplay-right-category'><span>Category :</span> Women, T-Shirt</p> */}
//  {/* <p className='productdisplay-right-category'><span>Tags :</span> Modern, Latest</p> */}