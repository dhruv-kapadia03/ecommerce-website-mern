import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar.jsx';
import { Routes, Route } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct.jsx';
import ListProduct from '../../Components/ListProduct/ListProduct.jsx';
import UserList from '../../Components/UserList/UserList.jsx';
import Promocode from '../../Components/Promocode/Promocode.jsx';

const Admin = () => {
  return (
    <div className='admin'>
        <Sidebar/>
        <Routes>
          <Route path='/userlist' element={<UserList/>} />
          <Route path='/listproduct' element={<ListProduct/>} />
          <Route path='/addproduct' element={<AddProduct/>} />
          <Route path='/promocode' element={<Promocode/>} />
        </Routes>
    </div>
  )
}

export default Admin;