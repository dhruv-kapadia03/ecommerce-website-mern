import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext.jsx';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum.jsx';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay.jsx';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox.jsx';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts.jsx';

const Product = () => {

  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  // const product = all_product.find((e) => e.id === Number(productId))
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (all_product && all_product.length > 0) {
        const foundProduct = all_product.find((p) => p.id === Number(productId));
        setProduct(foundProduct);
      }
    }, [all_product, productId]);

  if (!product) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  )
}

export default Product