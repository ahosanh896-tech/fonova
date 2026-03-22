import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
