import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import VerifyOtp from './components/VerifyOtp'
import Login from './components/Login'
import Profile from './components/Profile'
import Products from './components/Products'
import Order from './components/Order';
import SingleProduct from './components/SingleProduct';


import './App.css'

import ProductManage from './components/AdminDash/ProductManage'
import CouponManagement from './components/AdminDash/CouponManagement'


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/verifyotp' element={<VerifyOtp/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/products' element={<Products/>}></Route>
        <Route path='/orderpage' element={<Order/>}></Route>
        <Route path="/product/:id" element={<SingleProduct />} /> 


        {/* AdminPanel  */}
        <Route path='/admin/productmanage' element={<ProductManage/>}></Route>
        <Route path='/admin/couponmanage' element={<CouponManagement/>}></Route>




      </Routes>
    </Router>
    </>
  )
}

export default App
