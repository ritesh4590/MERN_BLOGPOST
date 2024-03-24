import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import './Options.css';
import { deleteBlog, updateBlog } from '../../redux/features/BlogSlice';

const ModifyOption = () => {
  const [deleteStatus, setDeleteStatus] = useState(false)
  const { id } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogDelete = async () => {
    const loginToken = localStorage.getItem("token")
    if (loginToken) {
      let bearerToken = `Bearer ${loginToken}`
      const deleteResponce = await dispatch(deleteBlog({ bearerToken, id }))
      setDeleteStatus(true)
      if (deleteResponce.payload.data.success === true) {
        navigate('/blogs')
      }
    }
  }

  const editBlog = async () => {
    navigate(`/edit/${id}`)
  }

  return (
    <div className="options">
      <ul>
        <li onClick={editBlog}>Edit Blog</li>
        <li onClick={blogDelete}>
          {deleteStatus ? "Deleting..." : "Delete Blog"}
        </li>
      </ul>

    </div>
  );
};

export default ModifyOption;
