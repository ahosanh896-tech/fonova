export const clearProductCache = async (slug) => {
  try {
    if (!redisClient.isOpen) return;

    if (slug) {
      await redisClient.del([`fornova:product:${slug}`]);
    }

    const stream = redisClient.scanIterator({
      MATCH: "fornova:products:*",
    });

    const keys = [];

    for await (const key of stream) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("CACHE ERROR:", err.message);
  }
};
