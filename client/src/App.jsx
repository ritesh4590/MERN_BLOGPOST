import { useState } from 'react'
import './App.css'
import Register from './pages/Register/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login'
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import Logout from './pages/Logout/Logout'
import PasswordReset from './pages/PasswordReset/PasswordReset'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Protected from './components/Protected'
import CreateBlog from './pages/Blog/CreateBlog/CreateBlog';
import SingleBlog from './pages/Blog/SingleBlog/SingleBlog';
import Blogs from './pages/Blog/Blogs/Blogs'
import EditBlog from './pages/Blog/EditBlog/EditBlog'
import UserProfile from './pages/UserProfile/UserProfile';

const App = () => {

  return (
    <BrowserRouter>
      <Header />
      <div className='body-container'>
        <Routes>
          {/* Auth Route start*/}
          <Route path='/' element={<Protected Component={Home} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/resetpassword' element={<PasswordReset />} />
          <Route path='/forgotpassword/:id/:token' element={<ForgotPassword />} />
          {/* Auth Route end*/}

          {/* Blog Route start*/}
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/create-blog' element={<Protected Component={CreateBlog} />} />
          <Route path='/:id' element={<SingleBlog />} />
          <Route path='/edit/:id' element={<EditBlog />} />
          {/* Blog Route end*/}
          {/* User Profile start*/}
          <Route path='user-profile' element={<UserProfile />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter >
  )
}

export default App
