import bcrypt from "bcrypt";
import jwt, { verify } from "jsonwebtoken";
import userModel from "../models/userModel";

const generateOtp = () => {
  String(Math.floor(100000 + Math.random() * 900000));
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.Node_ENV === "production",
  sameSite: process.env.Node_ENV === "production" ? "none" : "strict",

  maxAge: 7 * 24 * 60 * 60 * 10000,
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
          "Password must be at least 6 characters and include letters and numbers",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    await userModel.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now + 20 * 60 * 1000,
    });

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
