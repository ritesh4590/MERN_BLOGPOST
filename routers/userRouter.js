import express from "express";
const router = express.Router();

import { userProfile } from "../controllers/userController.js";

import { authMiddleware } from "../middleware/AuthMiddleware.js";

router.route("/userprofile").get(authMiddleware, userProfile);

export default router;
