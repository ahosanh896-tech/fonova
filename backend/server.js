import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import startCronJobs from "./config/cron.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

//start cron jobs
startCronJobs();

// routes
app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);

// start server with DB
const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    app.listen(port, () => {
      console.log("Server started on PORT: " + port);
    });
  } catch (error) {
    console.log("Server failed to start:", error);
  }
};

startServer();
