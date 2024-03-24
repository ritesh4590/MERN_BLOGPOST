import express from "express";
const router = express.Router();
import {
  login,
  register,
  user,
  sendpasswordlink,
  forgotPassword,
  updatePassword,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/AuthMiddleware.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").get(authMiddleware, user);
router.route("/sendpasswordlink").post(sendpasswordlink);
router.route("/forgotPassword/:id/:token").get(forgotPassword);
router.route("/:id/:token").post(updatePassword);

export default router;
