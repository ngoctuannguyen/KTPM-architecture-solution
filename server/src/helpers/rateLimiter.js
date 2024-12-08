import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "./redis.js"; // Tận dụng Redis client từ helpers

// Cấu hình rate limiter
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rate_limit",
  points: 20, // Tối đa 10 requests mỗi 60 giây
  duration: 60,
  blockDuration: 60, // Chặn trong 1 phút nếu vượt quá
});

// Middleware rate limiting
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next(); // Tiếp tục xử lý nếu không vượt giới hạn
    })
    .catch(() => {
      res.status(429).send("Quá nhiều yêu cầu, vui lòng thử lại sau.");
    });
};

export default rateLimiterMiddleware;
