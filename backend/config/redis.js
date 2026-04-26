import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

// error handler
redisClient.on("error", (err) => {
  console.error(" Redis Client Error:", err);
});

// connect function
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log(" Connected to Redis");
    }
  } catch (error) {
    console.error(" Failed to connect to Redis:", error);
  }
};

export default redisClient;
