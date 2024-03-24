import React, { useState, useEffect } from 'react'
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import * as Yup from 'yup'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { forgotPassword, updateForgottenPassword } from '../../redux/features/AuthSlice'
import './ForgotPassword.css'


const ForgotPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showCnfPassword, setCnfShowPassword] = useState(false)
  const [btnText, setBtnText] = useState(false)
  const [isLinkActive, setIsLinkActive] = useState(true)

  const { id, token } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(4, "Password must be at least 4 character")
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
      const validationResponse = await validationSchema.validate({ password, confirmpassword }, { abortEarly: false })
      console.log("validationResponse", validationResponse)
      if (validationResponse) {
        setError('')
      }
      setBtnText(true)
      const dispatchResponseupdatepassword = await dispatch(updateForgottenPassword({ id, token, password }))
      console.log("dispatchResponseupdatepassword:", dispatchResponseupdatepassword)
      console.log("Fetch")
      if (dispatchResponseupdatepassword.payload.data.success === true) {
        navigate('/login')
        toast.success("Password has been changed!")
      }
    } catch (error) {
      const newError = {}
      error.inner.forEach(err => {
        newError[err.path] = err.message
      })
      setError(newError)
    }
  }

  const verifyUser = async () => {
    const dispatchResponse = await dispatch(forgotPassword({ id, token }))
    console.log("Verify Link:", dispatchResponse)
    if (dispatchResponse.error.message === "Rejected") {
      setIsLinkActive(false)
    } else if (dispatchResponse.payload.data.success === true) {
      console.log("user is not valid")
    }
  }

  useEffect(() => {
    verifyUser()
  }, [])


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleCnfPasswordVisibility = () => {
    setCnfShowPassword(!showCnfPassword)
  }


  return (
    <div className='ForgotPassword-container'>
      {
        isLinkActive ?
          < div className='ForgotPassword-form-container' >
            <p className='ForgotPassword-title'>Forgot Password</p>
            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password ?
                <div className="ForgotPassword_togglePasswordbtn" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </div>
                : ''
              }
            </FloatingLabel>
            {error.password && <div className="ForgotPassword-error">{error.password}</div>}

            <FloatingLabel controlId="floatingconfirmPassword" label="Confirm Password" className="mb-3">
              <Form.Control
                type={showCnfPassword ? "text" : "password"}
                placeholder="confirm Password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmpassword ?
                <div className="ForgotPassword_togglePasswordbtn" onClick={toggleCnfPasswordVisibility}>
                  {showCnfPassword ? <EyeOff /> : <Eye />}
                </div>
                : ''
              }
            </FloatingLabel>
            {error.confirmpassword && <div className="ForgotPassword-error">{error.confirmpassword}</div>}
            <Button className='ForgotPassword-btn' style={{ backgroundColor: "#2d545e" }} onClick={handleSubmit} >
              {btnText ? "Submitting...." : "Submit"}
            </Button>
          </div >
          :
          <>
            <p className='expire-link'> Link has been expire,{' '}<span>
              <Link to={"/resetpassword"}>Click Here!</Link>
            </span> to generate new Link</p>
          </>
      }
    </div >
  )
}

export default ForgotPassword
