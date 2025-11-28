// src/config/redis.ts
import Redis from "ioredis";

// Regular Redis instance (for sessions, caching, etc.)
export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
});

// BullMQ requires a connection object
export const redisConnection = {
  connection: new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  }),
};
