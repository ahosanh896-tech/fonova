import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const isAdmin = (req, res, next) => {
  try {
    // userAuth already attached req.user , so no need to decoded
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.log("ADMIN AUTH:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default isAdmin;
