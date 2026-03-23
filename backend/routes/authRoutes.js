import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resendOtp,
  resetPassword,
  sendResetOtp,
  verifyOtp,
} from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/resend-verify-otp", resendOtp);

authRouter.get("/is-auth", isAuthenticated);

authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
