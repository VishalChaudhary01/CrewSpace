import rateLimit from "express-rate-limit";

export const baseLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 Minutes
  max: 100,
  message: "Too many requests from this IP. Please slow down.",
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 Minutes
  max: 5,
  message: "Too many requests attempts. Try again later.",
});
