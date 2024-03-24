import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import connectDB from "./DB/connectDB.js";
import authRoute from "./routers/authRouter.js";
import blogRoute from "./routers/blogRouter.js";
import userRoute from "./routers/userRouter.js";

connectDB(process.env.MONGO_URI);

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Route Middleware
app.use("/api/v1", authRoute);
app.use("/api/v1/", blogRoute);
app.use("/api/v1/user/", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running at Port:${PORT}`);
});
