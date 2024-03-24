import "./Header.css";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { Menu, Search } from "lucide-react"
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, FloatingLabel, Form, Image } from 'react-bootstrap';

import Logo from "../Logo/Logo";
import ProfileIcon from "../ProfileIcon.jsx/ProfileIcon";
import { user } from '../../redux/features/UserSlice'

const Header = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [search, setSearch] = useState('')
  const [firstChar, setFirstChar] = useState("")


  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const success = useSelector(state => state.user.user.success)
  const userDetail = useSelector(state => state.user.user)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const getLoggedInUser = async () => {
    const loginToken = localStorage.getItem("token")
    if (loginToken) {
      let bearerToken = `Bearer ${loginToken}`
      dispatch(user({ bearerToken }))

    }
  }


  const loggedInStatus = () => {
    const logInstatus = localStorage.getItem("token")
    if (logInstatus) {
      setIsLoggedIn(true)
    }
  }
  useEffect(() => {
    loggedInStatus()
    getLoggedInUser()
  }, [dispatch, pathname])

  const logout = () => {
    localStorage.removeItem("token")
    isLoggedIn(false)
  }

  const getFirstChar = async () => {
    return setFirstChar(userDetail.user.name.charAt(0))
  }

  useEffect(() => {
    getFirstChar()
  }, [userDetail])

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Search value:", search)
  }

  return (
    <div className="navbar">
      <div className="container"><Logo />
        <div className="menu-icon" onClick={handleShowNavbar}>
          <Menu />
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/blogs" >Blogs</NavLink>
            </li>
            {
              isLoggedIn ?
                <>
                  <li>
                    <NavLink to="/create-blog">Add Blog</NavLink>
                  </li>
                  <li>
                    <NavLink to="/logout" onClick={logout}>Logout</NavLink>
                  </li>
                </>
                :
                <>
                  <li>
                    <NavLink to="/login">Login</NavLink>
                  </li>
                  <li>
                    <NavLink to="/register">Register</NavLink>
                  </li>
                </>
            }
          </ul>
        </div>
        {/* <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </Form.Group>
        </Form> */}
        <div className="user-profile">
          <ProfileIcon firstChar={firstChar} user={userDetail} success={success} />
        </div>
      </div>
    </div>
  );
};

export default Header;
