import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Col, FloatingLabel, Form, } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import JoditEditor from 'jodit-react'
import './CreateBlog.css'
import { createBlog } from '../../../redux/features/BlogSlice';

const CreateBlog = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [loginToken, setLoginToken] = useState('')
  const [error, setError] = useState('')
  const [submit, setSubmit] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()


  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required")
  })


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {

      await validationSchema.validate({ title, description, category }, { abortEarly: false })

      const formData = new FormData()
      formData.append("title", title);
      formData.append("description", description)
      formData.append("category", category)
      formData.append("photo", image)
      const postData = {
        formData, loginToken
      }
      setSubmit(true)
      const dispatchResponse = await dispatch(createBlog(postData))
      if (dispatchResponse.payload.data.success === true) {
        toast.success("new blog created successfully!")
        navigate('/')
      } else {
        toast.error("Some Problem in creating new blog,Please try after some time")
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
      let bearerToken = `Bearer ${loginToken}`
      setLoginToken(bearerToken)
    }
  }, [])

  return (
    <div className='createBlog-container'>
      <Form>
        <FloatingLabel
          controlId="title"
          label="Blog title"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="name@example.com"
            value={title}
            onChange={(e) => setTitle(e.target.value)}

          />
        </FloatingLabel>

        {error.title && <div className="blog-error">{error.title}</div>}

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choose Image</Form.Label>
          <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>State</Form.Label>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Choose blog category</option>
            <option>Technology</option>
            <option>Drama</option>
            <option>Mysterious</option>
            <option>Education</option>
          </Form.Select>

        </Form.Group>
        {error.category && <div className="blog-cat-error">{error.category}</div>}
        <br />
        <FloatingLabel
          controlId="Description"
          label="Blog Description"
          className="mb-3"
        >
          <Form.Control
            as="textarea"
            placeholder="name@example.com"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="custom-textarea"
          />
        </FloatingLabel>
        {/* <JoditEditor ref={editor} value={description} onChange={newContent => setDescription(newContent)} /> */}
        {error.description && <div className="blog-error">{error.description}</div>}

        <Button color='#4B6BFB' className='create-blog-submitBtn' onClick={handleSubmit}>
          {submit ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </div >
  )
}

export default CreateBlog



