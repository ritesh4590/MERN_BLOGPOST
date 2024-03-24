import React, { useEffect } from 'react'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'
import avatarImage from '../../assets/image-avatar.png'
import { getUserProfile } from '../../redux/features/UserSlice'
import BlogCard from '../../components/Card/Card'
import Loader from '../../components/Loader/Loader'

const UserProfile = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fetchUserProfile = async () => {
    const loginToken = await localStorage.getItem("token")
    if (loginToken) {
      let bearerToken = `Bearer ${loginToken}`
      const profileRes = await dispatch(getUserProfile({ bearerToken }))
      console.log("profileRes", profileRes)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const userprofile = useSelector(state => state.user.userProfile.user)
  const userBlogs = useSelector(state => state.user.userProfile.userBlogs)

  return (
    <div className='user-profile-container'>
      <div className='user-bio-container'>
        <div className='user-bio'>
          <div className='user-name-container'>
            <div className='user-profile-img'>
              <img src={avatarImage} alt="image loading..." />
            </div>
            <div className='user-name-job'>
              <span className='author-name'>
                {userprofile && userBlogs ? `${userprofile.name}` : ""}
              </span>
              <span className='author-profession'>Collaborator & Editor</span>
            </div>
          </div>
          <div className='user-biodata'>
            {userprofile && userBlogs ?
              ` Meet ${userprofile.name}, a passionate writer and blogger with a love for technology and travel. ${userprofile.name} holds a degree in Computer Science and has spent years working in the tech industry, gaining a deep understanding of the impact technology has on our lives.`
              : ""}
          </div>
          <div className='user-social-media'>
            <span className='user-instagram'>
              <Instagram />
            </span>
            <span className='user-facebook'>
              <Facebook />
            </span>
            <span className='user-twitter'>
              <Twitter />
            </span>
            <span className='user-youtube'>
              <Youtube />
            </span>
          </div>
        </div>

      </div>
      <div className='user-blog-container'>
        <div className='Home-card'>
          {
            userprofile && userBlogs ?
              userBlogs.map((item) => {
                return (
                  <BlogCard blog={item} key={item._id} />
                )
              })
              : <Loader />
          }
        </div>
      </div>
    </div>


  )
}

export default UserProfile
