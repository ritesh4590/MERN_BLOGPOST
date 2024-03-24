import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { user } from '../../redux/features/UserSlice'
import image from '../../assets/banner-image.png'
import './Home.css'
import BlogCard from '../../components/Card/Card'
import { fetchAllBlog } from '../../redux/features/BlogSlice'
import Loader from '../../components/Loader/Loader'
import { Form } from 'react-bootstrap'

const Home = () => {
  const [usename, setUserName] = useState('')
  const [isUserFetched, setIsUserFetched] = useState(false)
  const [search, setSearch] = useState('')


  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()


  const getLoggedInUser = async () => {
    const loginToken = await localStorage.getItem("token")
    if (loginToken) {
      let bearerToken = `Bearer ${loginToken}`
      const loggedInUser = await dispatch(user({ bearerToken }))

      if (loggedInUser.payload.success === true) {
        setIsUserFetched(true)
        setUserName(loggedInUser.payload.user.name)
      }
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    console.log("Search:", search)
    dispatch(fetchAllBlog(search))

  }

  const getAllBlog = async () => {
    dispatch(fetchAllBlog(search))
  }

  useEffect(() => {
    getLoggedInUser()
    getAllBlog()
  }, [pathname, dispatch])

  const { isLoading } = useSelector(state => state.blog)
  const { blog } = useSelector(state => state.blog.blogs)

  return (
    <div className='home-container'>
      <div className='banner-container'>

        <img src={image} alt="Error in Banner Loading..." className='image' />

        <div className='banner-image-details'>
          <p className='blog-category'>Technology</p>
          <p className='blog-title'>The Impact of Technology on the Workplace: How Technology is Changing</p>
          <p className='blog-author-detail'> <span className='blog-author'>Tracey Wilson</span> {'  '}<span className='blog-publish-date'>16/03/2024</span></p>
        </div>

      </div>
      <Form onSubmit={handleSearch} className='search-bar'>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Form.Group>
      </Form>
      <div className='Home-card'>
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
export default Home
