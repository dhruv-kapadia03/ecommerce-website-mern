import React, { useEffect, useState } from 'react';
import Item from '../Item/Item.jsx';
import './NewCollections.css';

const NewCollections = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [collections, setCollections] = useState({
    All: [],
    Kids: [],
    Women: [],
    Men: [],
  });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true); 
      try {
        const newCollection = await fetch('/api/newcollections').then((res) => res.json());
        const kidsCollection = await fetch('/api/kidscollections').then((res) => res.json());
        const womensCollection = await fetch('/api/womenscollections').then((res) => res.json());
        const mensCollection = await fetch('/api/menscollections').then((res) => res.json());

        setCollections({
          All: newCollection,
          Kids: kidsCollection,
          Women: womensCollection,
          Men: mensCollection,
        });
      } catch (error) {
        console.error('Error fetching collections.');
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    };
    fetchCollections();
  }, []);

  const getCategoryData = () => {
    return collections[selectedCategory] || [];
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
    <div className="new-collections">
      <h1>ALL COLLECTION</h1>
      <hr />
      <div className="category-tabs">
        {['All', 'Kids', 'Women', 'Men'].map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="collections">
        {products.map((product) => (
          <Item key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;