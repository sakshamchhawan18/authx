// src/services/session.service.ts
import { redis } from "../config/redis";

const REFRESH_PREFIX = "refresh:"; // key prefix

export async function storeRefreshToken(jti: string, userId: string, ttlSeconds: number) {
  const key = REFRESH_PREFIX + jti;
  // store userId so we can validate ownership; set TTL
  await redis.set(key, userId, "EX", ttlSeconds);
}

export async function getUserIdByRefreshJti(jti: string): Promise<string | null> {
  const key = REFRESH_PREFIX + jti;
  const val = await redis.get(key);
  return val;
}

export async function revokeRefreshToken(jti: string) {
  const key = REFRESH_PREFIX + jti;
  await redis.del(key);
}
