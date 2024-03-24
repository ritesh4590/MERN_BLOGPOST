import express from "express";
const router = express.Router();
import multer from "multer";
import {
  createBlog,
  getAllBlog,
  getBlogById,
  deleteBlog,
  updateBlog,
} from "../controllers/blogController.js";

import { authMiddleware } from "../middleware/AuthMiddleware.js";

// image storage path
const imageConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

// image filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only Image allowed"));
  }
};

const upload = multer({
  storage: imageConfig,
  fileFilter: isImage,
});

router
  .route("/createblog")
  .post(authMiddleware, upload.single("photo"), createBlog);
router.route("/").get(getAllBlog);
router.route("/:id").get(getBlogById);
router.route("/:id").delete(authMiddleware, deleteBlog);
router.route("/updateBlog/:id").put(authMiddleware, updateBlog);

export default router;
