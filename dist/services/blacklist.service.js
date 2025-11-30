"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistAccessToken = blacklistAccessToken;
exports.isAccessTokenBlacklisted = isAccessTokenBlacklisted;
// src/services/blacklist.service.ts
const redis_1 = require("../config/redis");
const BLACKLIST_PREFIX = process.env.JWT_BLACKLIST_PREFIX || "blacklist:";
async function blacklistAccessToken(jtiOrTokenId, ttlSeconds) {
    const key = `${BLACKLIST_PREFIX}${jtiOrTokenId}`;
    await redis_1.redis.set(key, "1", "EX", ttlSeconds);
}
async function isAccessTokenBlacklisted(jtiOrTokenId) {
    const key = `${BLACKLIST_PREFIX}${jtiOrTokenId}`;
    const val = await redis_1.redis.get(key);
    return val !== null;
}
