// src/config/redis.ts
import Redis from "ioredis";

// If Railway gives full REDIS_URL, use it directly
if (process.env.REDIS_URL) {
  console.log("Using Railway Redis URL");
}

export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
    });

// BullMQ requires a connection object
export const redisConnection = {
  connection: process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL)
    : new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || undefined,
      }),
};
