import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import toast from 'react-hot-toast';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const res = await fetch('/api/getallproducts');
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);


  const handleStockChange = async (id, currentStockStatus)=>{
    try {
      setAllProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id ? { ...product, available: !currentStockStatus } : product
        )
      );
      const res = await fetch('/api/updateStockStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, newStockStatus: !currentStockStatus }),
      });
      if (!res.ok) {
        fetchInfo(); 
        throw new Error('Failed to update stock status');
      }
      toast.success(`Product ${currentStockStatus ? 'set to Out of Stock' : 'set to In Stock'}`); 
    } catch (error) {
      console.error('Error updating stock status:', error);
      toast.error('Failed to update stock status.');
    }
  }

  const remove_product = async (id) => {
    try {
      await fetch('/api/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      fetchInfo();
    } catch (error) {
      toast.error('Error Removing Product.', error);
    } finally {
      toast.success('Product Removed Successfully.');
    }
  };

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div className="listproduct-header">
        <div className="listproduct-header-item">Products</div>
        <div className="listproduct-header-item">Title</div>
        <div className="listproduct-header-item">Status</div>
        <div className="listproduct-header-item">Price</div>
        <div className="listproduct-header-item">Category</div>
        <div className="listproduct-header-item">Remove</div>
      </div>
      <div className="listproduct-allproducts">
        {allproducts.map((product) => (
          <div key={product.id} className="listproduct-item">
            <img src={product.image} className="listproduct-product-icon" alt="" />
            <p className="listproduct-title">{product.name}</p>
            <p className="listproduct-stock">
              <button
                onClick={() => handleStockChange(product.id, product.available)}
                className={product.available ? 'in-stock' : 'out-of-stock'}
              >
                {product.available ? 'In Stock' : 'Out of Stock'}
              </button>
            </p>
            <p className="listproduct-price">₹{product.new_price}</p>
            <p className="listproduct-category">{product.category}</p>
            <button className="remove-button" onClick={() => remove_product(product.id)}>
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;