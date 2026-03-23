import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { generateOtp } from "../utils/generateOtp.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include letters and numbers",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser && existingUser.isAccountVerified) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    if (
      existingUser &&
      existingUser.verifyOtpExpireAt &&
      existingUser.verifyOtpExpireAt > Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP already sent. Please wait",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    let user;

    if (existingUser) {
      existingUser.verifyOtp = hashedOtp;
      existingUser.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000;

      user = await existingUser.save();
    } else {
      user = await userModel.create({
        name: name.trim(),
        email,
        password: hashedPassword,
        verifyOtp: hashedOtp,
        verifyOtpExpireAt: Date.now() + 5 * 60 * 1000,
      });
    }

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return res.status(201).json({
      success: true,
      message: "OTP sent to email. Please verify your account",
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await userModel.findOne({ email }).select("+password");

    // unified error
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    if (!user.isAccountVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // remove password
    user.password = undefined;

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email }).select("+verifyOtp");

    //if the otp or user not exist in mongoose
    if (!user || !user.verifyOtp) {
      return res.status(400).json({
        return: false,
        message: "Invalid request",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.verifyOtp);

    if (!isMatch) {
      return req.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    user.verifiedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: "Account verified",
    });
  } catch (error) {
    console.log("VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Already verified",
      });
    }

    // Prevent spam
    if (user.verifyOtpExpireAt && user.verifyOtpExpireAt > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "wait before requesing new OTP",
      });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.verifyOtp = hashedOtp;
    user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Resend OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      success: true,
      message: "OTP resent",
    });
  } catch (error) {
    console.log("RESENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("AUTHENTICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const sendResetOtp = async (req, res) => {};

export const resetPassword = async (req, res) => {};
