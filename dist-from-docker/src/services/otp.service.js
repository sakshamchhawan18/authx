"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.verifyOtp = verifyOtp;
const redis_1 = require("../config/redis");
const OTP_PREFIX = "otp:";
const OTP_EXPIRY = 60 * 5; // 5 minutes
// Generate and store OTP
async function generateOtp(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis_1.redis.set(OTP_PREFIX + email, otp, "EX", OTP_EXPIRY);
    return otp;
}
// Verify OTP
async function verifyOtp(email, otp) {
    const stored = await redis_1.redis.get(OTP_PREFIX + email);
    if (!stored || stored !== otp)
        return false;
    await redis_1.redis.del(OTP_PREFIX + email); // OTP used → delete
    return true;
}
