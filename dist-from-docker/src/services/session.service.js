"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRefreshToken = storeRefreshToken;
exports.getUserIdByRefreshJti = getUserIdByRefreshJti;
exports.revokeRefreshToken = revokeRefreshToken;
// src/services/session.service.ts
const redis_1 = require("../config/redis");
const REFRESH_PREFIX = "refresh:"; // key prefix
async function storeRefreshToken(jti, userId, ttlSeconds) {
    const key = REFRESH_PREFIX + jti;
    // store userId so we can validate ownership; set TTL
    await redis_1.redis.set(key, userId, "EX", ttlSeconds);
}
async function getUserIdByRefreshJti(jti) {
    const key = REFRESH_PREFIX + jti;
    const val = await redis_1.redis.get(key);
    return val;
}
async function revokeRefreshToken(jti) {
    const key = REFRESH_PREFIX + jti;
    await redis_1.redis.del(key);
}
