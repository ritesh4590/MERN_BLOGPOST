import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import './Blogs.css'
import BlogCard from '../../../components/Card/Card'
import { fetchAllBlog } from '../../../redux/features/BlogSlice'
import Loader from '../../../components/Loader/Loader'
import { Form } from 'react-bootstrap'


const Blogs = () => {
  const [search, setSearch] = useState('')

  const dispatch = useDispatch()
  const { pathname } = useLocation()

  const getAllBlog = async () => {
    dispatch(fetchAllBlog())
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    console.log("Search:", search)
    dispatch(fetchAllBlog(search))

  }

  useEffect(() => {
    getAllBlog()
  }, [pathname, dispatch])

  const { isLoading } = useSelector(state => state.blog)
  const { blog } = useSelector(state => state.blog.blogs)

  return (
    <div className='home-container'>
      <div className='Home-card'>
        <Form onSubmit={handleSearch} className='search-bar'>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </Form.Group>
        </Form>
        {
          isLoading === false && blog ?
            blog.map((item) => {
              return (
                <BlogCard blog={item} key={item._id} />
              )
            })
            : <Loader />
        }
      </div>
    </div>
  )

}
export default Blogs
