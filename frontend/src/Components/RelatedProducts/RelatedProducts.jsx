import React, { useEffect, useState } from 'react';
import Item from '../Item/Item.jsx';
import './RelatedProducts.css';

const RelatedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [relatedProducts, setRelatedProducts] = useState({
    All: [],
    Kids: [],
    Women: [],
    Men: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchrelatedProducts = async () => {
      setLoading(true);
      try {
        const relatedinAll = await fetch('/api/relatedproducts').then((res) => res.json());
        const relatedinKids = await fetch('/api/relatedinkids').then((res) => res.json());
        const relatedinWomens = await fetch('/api/relatedinwomens').then((res) => res.json());
        const relatedinMens = await fetch('/api/relatedinmens').then((res) => res.json());

        setRelatedProducts({
          All: relatedinAll,
          Kids: relatedinKids,
          Women: relatedinWomens,
          Men: relatedinMens,
        });
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchrelatedProducts();
  }, []);

  const getCategoryData = () => {
    return relatedProducts[selectedCategory] || [];
  };
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category !== selectedCategory) {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: window.scrollY,
          behavior: 'auto',
        });
      });
    }
  };

  const products = getCategoryData();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr />
        <div className="category-tabs">
        {['All', 'Kids', 'Women', 'Men'].map(category => (
          <button 
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="relatedproducts-item">
        {products.map(product => (
          <Item key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts;