import { createClient } from "redis";

// Kết nối Redis
const redisClient = createClient({
  password: "y7LDDpZhdVT6D6yIFaXeA8UjiZlUJlbI",
  socket: {
    host: "redis-19563.c8.us-east-1-4.ec2.redns.redis-cloud.com",
    port: 19563,
  },
});

redisClient.on("connect", () => console.log("Redis connected!"));
redisClient.on("error", (err) => console.error("Redis error:", err.message));

export async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connection successful!");

    // Gửi lệnh PING để xác minh kết nối
    const pong = await redisClient.ping();
    console.log("PING response from Redis:", pong); // Phản hồi 'PONG' nếu thành công
  } catch (err) {
    console.error("Error connecting to Redis:", err.message);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
}

export async function setCache(key, value, ttl = 3600) {
  await redisClient.set(key, value, { EX: ttl }); // TTL tính bằng giây
}

export async function getCache(key) {
  try {
    const value = await redisClient.get(key);
    return value;
  } catch (err) {
    console.error("Error getting cache:", err.message);
    return null;
  }
}

export { redisClient };
