import redisClient from "../config/redis.js";

export const clearProductCache = async (slug) => {
  if (slug) {
    await redisClient.del(`fornova:product:${slug}`);
  }

  const stream = redisClient.scanIterator({
    MATCH: "fornova:products:*",
  });

  const keys = [];
  for await (const key of stream) {
    keys.push(key);
  }

  if (keys.length) {
    await redisClient.del(...keys);
  }
};
