import React, { useEffect, useState } from 'react';
import Item from '../Item/Item.jsx';
import './Popular.css';

const Popular = () => {
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [popularProducts, setPopularProducts] = useState({
    Popular: [],
    Kids: [],
    Women: [],
    Men: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchpopularProducts = async () => {
      setLoading(true);
      try {
        const popularinAll = await fetch('/api/popular').then((res) => res.json());
        const popularinKids = await fetch('/api/popularinkids').then((res) => res.json());
        const popularinWomens = await fetch('/api/popularinwomens').then((res) => res.json());
        const popularinMens = await fetch('/api/popularinmens').then((res) => res.json());
    
        setPopularProducts({
          Popular: popularinAll,
          Kids: popularinKids,
          Women: popularinWomens,
          Men: popularinMens,
        });
      } catch (error) {
        console.error('Error fetching popular products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchpopularProducts();
  }, []);

  const getCategoryData = () => {
    return popularProducts[selectedCategory] || [];
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
    <div className="popular">
      <h1>Popular in Collection</h1>
      <hr />
      <div className="category-tabs">
        {['Popular', 'Kids', 'Women', 'Men'].map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="popular-item">
        {products.map((product) => (
          <Item key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Popular;
