// src/services/blacklist.service.ts
import { redis } from "../config/redis";

const BLACKLIST_PREFIX = process.env.JWT_BLACKLIST_PREFIX || "blacklist:";

export async function blacklistAccessToken(jtiOrTokenId: string, ttlSeconds: number) {
  const key = `${BLACKLIST_PREFIX}${jtiOrTokenId}`;
  await redis.set(key, "1", "EX", ttlSeconds);
}

export async function isAccessTokenBlacklisted(jtiOrTokenId: string): Promise<boolean> {
  const key = `${BLACKLIST_PREFIX}${jtiOrTokenId}`;
  const val = await redis.get(key);
  return val !== null;
}
