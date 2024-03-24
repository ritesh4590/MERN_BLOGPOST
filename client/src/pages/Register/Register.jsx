import React, { useEffect, useState } from 'react'
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { register } from '../../redux/features/AuthSlice';
import "react-toastify/dist/ReactToastify.css";

import './Register.css'

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showCnfPassword, setCnfShowPassword] = useState(false)
  const [btnText, setBtnText] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string()
      .min(4, "Password must be at lease 4 character")
      .matches(/[!@#$%^&*(),.?"{|<>}]/, "Password must contain at least one special character")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
    confirmpassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref("password")], "Password must match")
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await validationSchema.validate({ name, email, password, confirmpassword }, { abortEarly: false })
      setBtnText(true)
      const registerResponse = await dispatch(register({ name, email, password }))
      console.log("registerResponse:", registerResponse)
      if (registerResponse.payload === undefined) {
        toast.error(registerResponse.error.message);
      }
      else if (registerResponse.payload.success === true) {
        navigate('/')
        toast.success('Registration Successfully!');
      }
    } catch (error) {
      const newError = {}
      error.inner.forEach(err => {
        newError[err.path] = err.message
      })
      setError(newError)
    }
  }

  useEffect(() => {
    const loginToken = localStorage.getItem("token")
    if (loginToken) {
      navigate('/')
    }
  }, [])


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleCnfPasswordVisibility = () => {
    setCnfShowPassword(!showCnfPassword)
  }

  return (
    <div className='register-container'>
      <p className='register-title'>Register</p>
      <div className='register-form-container'>
        <FloatingLabel
          controlId="floatingname"
          label="Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FloatingLabel>
        {error.name && <div className="register-error">{error.name}</div>}

        <FloatingLabel
          controlId="floatingemail"
          label="Email"
          className="mb-3"
        >
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>
        {error.email && <div className="register-error">{error.email}</div>}

        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password ?
            <div className="register_togglePasswordbtn" onClick={togglePasswordVisibility}>
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
            : ''
          }
        </FloatingLabel>
        {error.password && <div className="register-error">{error.password}</div>}

        <FloatingLabel controlId="floatingconfirmPassword" label="Confirm Password" className="mb-3">
          <Form.Control
            type={showCnfPassword ? "text" : "password"}
            placeholder="confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmpassword ?
            <div className="register_togglePasswordbtn" onClick={toggleCnfPasswordVisibility}>
              {showCnfPassword ? <EyeOff /> : <Eye />}
            </div>
            : ''
          }
        </FloatingLabel>
        {error.confirmpassword && <div className="register-error">{error.confirmpassword}</div>}

        <Button className='register-btn' style={{ backgroundColor: "#2d545e" }} onClick={handleSubmit} >
          {btnText ? "Registering...." : "Register"}
        </Button>
      </div>
      <p className='register-bottomText'>Already have an account?{" "}
        <span>
          <Link to={'/login'}> Login</Link>
        </span>
      </p>
    </div>
  )
}

export default Register



