import Blog from "../models/blogModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

const createBlog = async (req, res) => {
  console.log("rew.file", req.file);
  const upload = await cloudinary.uploader.upload(req.file.path);
  console.log("photo:", upload);

  const { title, description, category, image } = req.body;
  console.log(title, description, category);
  try {
    if (!title || !description || !category || image) {
      return res
        .status(401)
        .json({ success: false, message: "Please provide all field" });
    }
    console.log("req-user:", req.user);
    const authorName = req.user.name;
    const author_id = req.user._id;

    const blog = new Blog({
      title,
      description,
      category,
      image: upload.secure_url,
      author: authorName,
      authorId: author_id,
    });
    await blog.save();
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const getAllBlog = async (req, res) => {
  let search = req.query.search || "";
  const query = {
    title: { $regex: search, $options: "i" },
  };
  try {
    const blog = await Blog.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const getBlogById = async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById({ _id: id });
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const deleteBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteBlog = await Blog.findByIdAndDelete({ _id: id });
    return res
      .status(200)
      .json({ success: true, message: "Blog has been deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const updateBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const findBlog = await Blog.findById({ _id: id });
    if (!findBlog) {
      return res.status(401).json({ success: false, message: "Invalid Id" });
    }
    const blog = await Blog.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    await blog.save();
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

export { createBlog, getAllBlog, getBlogById, deleteBlog, updateBlog };
