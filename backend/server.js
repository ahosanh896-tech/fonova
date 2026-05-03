import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectRedis } from "./config/redis.js";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import startCronJobs from "./config/cron.js";
import paymentRouter from "./routes/paymentRoutes.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:6024", // user frontend
      "http://localhost:6025", // admin panel
    ],
    credentials: true,
  }),
);

app.use(
  "/api/payment/stripe/webhook",
  express.raw({ type: "application/json" }),
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
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/payment", paymentRouter);

// start server with DB
const startServer = async () => {
  try {
    await connectDB();

    await connectRedis();

    connectCloudinary();

    app.listen(port, () => {
      console.log("Server started on PORT: " + port);
    });
  } catch (error) {
    console.log("Server failed to start:", error);
  }
};

startServer();
