import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide Title"],
    },
    image: {
      type: String,
      // required: [true, "Please enter Image"],
    },
    category: {
      type: String,
      required: [true, "Please fill this field"],
    },
    description: {
      type: String,
      required: [true, "Please provide Descrption"],
    },
    author: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);
export default Blog;
