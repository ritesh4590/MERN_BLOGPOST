import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import './SingleBlog.css'
import { fetchBlogById } from '../../../redux/features/BlogSlice'
import Loader from '../../../components/Loader/Loader'
import imageAvatar from '../../../assets/image-avatar.png'
import ProfileIcon from '../../../components/ProfileIcon.jsx/ProfileIcon'
import Options from '../../../components/Options/Options'
import ModifyOption from '../../../components/Options/ModifyOptions'

const SingleBlog = () => {
  const [publishDate, setPublishDateDate] = useState("")
  const [showOptions, setShowOptions] = useState(false);

  const { id } = useParams()
  const dispatch = useDispatch()

  const getBlogById = () => {
    dispatch(fetchBlogById(id))
  }

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => { getBlogById() }, [dispatch])

  const { isLoading } = useSelector(state => state.blog)
  const { blog } = useSelector(state => state.blog.currentBlog)
  const { user } = useSelector(state => state.user.user)

  const formatDate = async () => {
    const formattedDate = await moment(blog.createdAt).format('Do MMMM YYYY');
    setPublishDateDate(formattedDate)
  }
  useEffect(() => {
    formatDate()
  }, [blog])



  return (
    <div className='single-blog-container'>
      {
        isLoading === false && blog ?
          <>
            <div className='sb-edit-n-cate'>
              <p className='sb-blog-category'>{blog.category}</p>
              {user._id === blog.authorId ?
                <p className="blog-option-btn" onClick={toggleOptions}>
                  Blog Options
                  {showOptions && <ModifyOption />}
                </p >
                : ""}
            </div>
            <p className='sb-blog-title'>{blog.title}</p>
            <span className='sb-author-details'>
              <img src={imageAvatar} alt="" className='sb-card-author-avatar' />
              <span>{blog.author}</span>
              <span>{publishDate}</span>
            </span>
            <img src={blog.image} alt="Image is Loading..." className='blog-image' />
            <p>{blog.description}</p>
          </>
          :
          <Loader />
      }
    </div >
  )
}

export default SingleBlog
