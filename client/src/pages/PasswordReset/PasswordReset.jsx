import React, { useState } from 'react'
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { sendPasswordResetLink } from '../../redux/features/AuthSlice'
import './PasswordReset.css'


const PasswordReset = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(false)
  const [error, setError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid email"),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Email:", email)
    try {
      await validationSchema.validate({ email }, { abortEarly: false })
      const dispatchRes = await dispatch(sendPasswordResetLink({ email }))
      console.log("dispatch response:", dispatchRes)
      if (dispatchRes.payload === undefined) {
        toast.error(dispatchRes.error.message)
      }
      else if (dispatchRes.payload.data.success === true) {
        setMessage(true)
        setError('')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className='resetPass-container'>
      <p className='resetPass-title'>Forgot Password</p>
      <div className='resetPass-form-container'>
        {message === true ? <div className="resetPass-message">Password reset link has been sent</div> : ''}
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
            required
          />
        </FloatingLabel>
        {error && <div className="resetPass-error">{error}</div>}
        <Button className='resetPass-btn' style={{ backgroundColor: "#2d545e" }} onClick={handleSubmit} >Send</Button>
      </div>

    </div>
  )
}

export default PasswordReset



