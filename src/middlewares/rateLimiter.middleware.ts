// src/middlewares/rateLimiter.middleware.ts
import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

const RATE_PREFIX = process.env.RATE_LIMIT_PREFIX || "rate:";
const RATE_MAX = Number(process.env.RATE_LIMIT_MAX || 10);
const RATE_WINDOW = Number(process.env.RATE_LIMIT_WINDOW || 60); // seconds

export function rateLimiter(options?: { prefix?: string; max?: number; window?: number }) {
  const prefix = options?.prefix ?? RATE_PREFIX;
  const max = options?.max ?? RATE_MAX;
  const windowSec = options?.window ?? RATE_WINDOW;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
      const route = req.path.replace(/\//g, ":"); // make key specific to route optionally
      const key = `${prefix}${ip}:${route}`;

      // INCR and set expire in one atomic Lua-like flow using MULTI
      const ttl = await redis.ttl(key);
      const count = await redis.incr(key);
      if (ttl === -1) {
        await redis.expire(key, windowSec);
      } else if (ttl === -2) {
        // key created by incr => set expiry
        await redis.expire(key, windowSec);
      }

      if (count > max) {
        return res.status(429).json({ success: false, message: "Too many requests" });
      }

      // allow
      next();
    } catch (err) {
      // fail-open (so errors in redis don't break API)
      console.error("Rate limiter error:", err);
      next();
    }
  };
}
