import bcrypt from "bcrypt";

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
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //check verification
    if (!user.isAccountVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const logout = async (req, res) => {};

export const resendOtp = async (req, res) => {};

export const verifyOtp = async (req, res) => {};

export const isAuthenticated = async (req, res) => {};

export const sendResetOtp = async (req, res) => {};

export const resetPassword = async (req, res) => {};
