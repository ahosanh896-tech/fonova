import jwt from "jsonwebtoken";

const userAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("USER AUTH:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
