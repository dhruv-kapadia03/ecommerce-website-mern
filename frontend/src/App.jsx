import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';
import Shop from './Pages/Shop.jsx';
import ShopCategory from './Pages/ShopCategory.jsx';
import Product from './Pages/Product.jsx';
import Cart from './Pages/Cart.jsx';
import LoginSignup from './Pages/LoginSignup.jsx';
import Footer from './Components/Footer/Footer.jsx';
import kids_banner from './Components/Assets/banner_kid.png';
import women_banner from './Components/Assets/banner_women.png';
import men_banner from './Components/Assets/banner_men.png';
import UserProfile from './Pages/UserProfile.jsx'
import Checkout from './Pages/Checkout.jsx';
import PaymentSuccess from './Pages/PaymentSuccess.jsx';
import PaymentFailed from './Pages/PaymentFailed.jsx';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          
          <Route path="/" element={<Shop />} />
          <Route path='/userprofile' element={<UserProfile />} />
          <Route path="/kids" element={<ShopCategory banner={kids_banner} category='kid'/>} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} category='women'/>} />
          <Route path="/mens" element={<ShopCategory banner={men_banner} category='men'/>} />
          
          <Route path="/product" element={<Product />}>
            <Route path=':productId' element={<Product />}/>
          </Route>

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/login" element={<LoginSignup />} />

        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App;
