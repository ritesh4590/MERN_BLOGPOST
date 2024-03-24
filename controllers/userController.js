import Blog from "../models/blogModel.js";

const userProfile = async (req, res) => {
  const user = req.user;
  console.log("User:", req.user);
  try {
    const userBlogs = await Blog.find({ authorId: user._id });
    // const userprofile = {
    //   user,
    //   usersBlog,
    // };
    return res.status(200).json({ success: true, user, userBlogs });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

export { userProfile };
