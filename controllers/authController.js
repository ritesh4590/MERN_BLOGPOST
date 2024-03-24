import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/authModel.js";
import { sendEmail } from "../utils/sendEmail.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(401)
        .json({ success: false, message: "Please Enter required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(401)
        .json({ success: false, message: "This email already Exists" });
    }

    const user = new User({ name, email, password });
    await user.save();
    const message = `<h3>Dear ${name}</h3>

    We are thrilled to welcome you to Uphaar! Thank you for choosing us as your destination. Your registration has been successfully completed, and we are excited to have you join our community.
    
   <h3> Best regards</h3>  
    `;
    const options = {
      email: email,
      subject: "Uphaar Registration Successfully",
      message,
    };
    await sendEmail(options);
    res.status(200).json({
      success: true,
      userID: user._id,
      token: await user.generateToken("30d"),
      user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(401)
        .json({ success: false, message: "Please Enter required fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
      return res.status(200).json({
        success: true,
        userId: user._id.toString(),
        token: await user.generateToken("30d"),
        user,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email or password" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const user = async (req, res) => {
  const user = req.user;
  console.log("User:", req.user);
  try {
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const sendpasswordlink = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "Enter Your Email" });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't Exist" });
    }
    const resetToken = await userExist.generateToken("120sec");
    const setUserToken = await User.findByIdAndUpdate(
      { _id: userExist._id },
      { verifyToken: resetToken },
      { new: true }
    );
    if (setUserToken) {
      // localhost:5173 = ${req.get("host")}
      const resetUrl = `${req.protocol}://localhost:5173/forgotpassword/${userExist.id}/${setUserToken.verifyToken}`;

      const message = `
      <h1>You have requested password reset</h1>
      <p style="color:green">Please click this link to reset your Password,This link will valid only for 2 minutes.</p> 
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      <p>If you have not requested this mail, please ignore it.</p>
      `;
      const options = {
        email: userExist.email,
        subject: "Password reset link",
        message: message,
      };
      sendEmail(options);
      return res
        .status(200)
        .json({ success: true, message: "Email Sent successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  const { id, token } = req.params;
  try {
    const validUser = await User.findOne({ _id: id, verifyToken: token });
    const isTokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (validUser && isTokenVerified) {
      return res.status(201).json({ success: true, validUser });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "User not exists" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const updatePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const validUser = await User.findOne({ _id: id, verifyToken: token });
    const isTokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("valid user in update password:", validUser);
    if (validUser && isTokenVerified) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.findByIdAndUpdate(
        { _id: id },
        { password: hashedPassword }
      );
      await newUser.save();
      const message = `
      <h3>Congratulation you have successfully change your password</h3>
      <p>You have changed the password of <u>${newUser.email}</u></p>
      `;
      const options = {
        email: newUser.email,
        subject: "Password change successfully",
        message,
      };
      await sendEmail(options);
      return res.status(201).json({ success: true, newUser });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "User not exists" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

export {
  register,
  login,
  user,
  sendpasswordlink,
  forgotPassword,
  updatePassword,
};
