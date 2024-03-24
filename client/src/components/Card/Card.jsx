import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import moment from 'moment';
import './Card.css'
import avatar from '../../assets/image-avatar.png'


const BlogCard = ({ blog }) => {
  const [publishDate, setPublishDateDate] = useState("")

  const formatDate = async () => {
    const formattedDate = await moment(blog.createdAt).format('Do MMMM YYYY');
    setPublishDateDate(formattedDate)
  }
  useEffect(() => {
    formatDate()
  }, [blog])
  return (
    <Link className='card-link-wrapper' key={blog.id} to={`/${blog._id}`}>
      <Card className='card-container'>
        <Card.Img variant="top" src={blog.image} className='card-Image' />
        <Card.Body className='card-body'>
          <Card.Text className='card-blog-category'>
            {blog.category}
          </Card.Text>
          <Card.Title className='card-blog-title'>{blog.title}</Card.Title>
          <Card.Text className='card-blog-author'>
            <span className='card-author-avatar'>
              <img src={avatar} alt="" />
            </span>
            <span className='card-author-name'>{blog.author}</span>
            <span className='card-blog-publish-date'>{publishDate}</span>
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default BlogCard;