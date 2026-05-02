import "dotenv/config";
import connectDB from "../config/mongodb.js";

import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { sendOrderEmail } from "../services/emailService.js";
import { sendNotification } from "../services/notificationService.js";
import orderModel from "../models/orderModel.js";

await connectDB();
console.log("Worker DB connected");

const worker = new Worker(
  "orderQueue",
  async (job) => {
    if (job.name === "order-created") {
      const { orderId, userId, email, total } = job.data;

      console.log("Processing order:", orderId);

      // email
      try {
        await sendOrderEmail({
          email,
          orderId,
          total,
        });
        console.log("Order email queued for:", email);
      } catch (error) {
        console.error("Order email failed:", error);
      }

      // notification
      try {
        const order = await orderModel.findById(orderId).lean();
        const itemCount = order?.orderItems?.length || 0;
        const firstProductName = order?.orderItems?.[0]?.name || "your items";
        const message =
          itemCount === 1
            ? `Your order for ${firstProductName} is confirmed`
            : `Your order with ${itemCount} items, including ${firstProductName}, is confirmed`;

        await sendNotification({
          userId,
          message,
        });
        console.log("Notification created for user:", userId);
      } catch (error) {
        console.error("Notification creation failed:", error);
      }
    }
  },
  {
    connection: redisConnection,
  },
);

// logs
worker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Job failed:", err);
});
