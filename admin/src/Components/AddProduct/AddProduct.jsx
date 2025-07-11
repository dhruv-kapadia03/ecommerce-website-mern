import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import toast from 'react-hot-toast';

const AddProduct = () => {

  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    // old_price: "",
    new_price: ""
  });

  const imageHandler = (e)=> {
    setImage(e.target.files[0]);
  }
  const changeHandler = (e)=> {
    setProductDetails({...productDetails, [e.target.name]: e.target.value});
  }
  const Add_Product = async ()=> {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image);

    await fetch('/api/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    }).then((res) => res.json()).then((data)=>{responseData=data});
    
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch('/api/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product),
      }).then((res)=>res.json()).then((data)=>{
        data.success?toast.success("Product Added."):toast.error("Failed to add.")
      })
    }
  }

  return (
    <div className='add-product'> 
      <div className='addproduct-itemfield'>
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type Here' />
      </div>
      <div className="addproduct-price">
        {/* <div className="addproduct-itemfield">
          <p>Price</p>
          <input type="text" name='old_price' placeholder='Type Here' />
        </div> */}
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} className='new-price' type="number" name='new_price' placeholder='Type Here' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="kid">Kid</option>
          <option value="men">Men</option>
        </select>
      </div>
      <div className='addproduct-itemfield'>
        <label htmlFor="file-input">
          <img src={image?URL.createObjectURL(image):upload_area} className="addproduct-thumbnail-img" alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={Add_Product} className='addproduct-btn'>Add</button>
    </div>
  )
}

export default AddProduct