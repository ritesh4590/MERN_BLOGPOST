import React, { useState, useEffect } from 'react'
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import './Login.css'
import { login } from '../../redux/features/AuthSlice';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [btnText, setBtnText] = useState(false)


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string()
      .min(4, "Password must be at least 4 character")
      .required("Password is required"),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await validationSchema.validate({ email, password }, { abortEarly: false })
      setBtnText(true)

      const loginResponse = await dispatch(login({ email, password }))
      console.log("loginResponse:", loginResponse)
      if (loginResponse.payload === undefined) {
        toast.error(loginResponse.error.message);
        setBtnText(false)
      }
      else if (loginResponse.payload.success === true) {
        navigate('/')
        toast.success('Login Successfully!');
        setBtnText(false)
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

  return (
    <div className='login-container'>
      <p className='login-title'>Login</p>
      <div className='login-form-container'>

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
        {error.email && <div className="login-error">{error.email}</div>}

        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password ?
            <div className="login_togglePasswordbtn" onClick={togglePasswordVisibility}>{showPassword ? <EyeOff /> : <Eye />}</div>
            : ''}
        </FloatingLabel>
        {error.password && <div className="login-error">{error.password}</div>}

        <Button className='login-btn' style={{ backgroundColor: "#2d545e" }} onClick={handleSubmit} >
          {btnText ? "Logging..." : "Login"}
        </Button>
      </div>

      <p className='login-bottomText '>Don't have an account? {' '}
        <span>
          <Link to={'/register'}>Register</Link>
        </span>
      </p>
      <p className='login-bottomText '>
        <span>
          <Link to={'/resetpassword'}>Forgot password</Link>
        </span>
      </p>
    </div>
  )
}

export default Login



