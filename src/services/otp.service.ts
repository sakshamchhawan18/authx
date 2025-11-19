import { redis } from "../config/redis";

const OTP_PREFIX = "otp:";
const OTP_EXPIRY = 60 * 5; // 5 minutes

// Generate and store OTP
export async function generateOtp(email: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(OTP_PREFIX + email, otp, "EX", OTP_EXPIRY);

  return otp;
}

// Verify OTP
export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  const stored = await redis.get(OTP_PREFIX + email);

  if (!stored || stored !== otp) return false;

  await redis.del(OTP_PREFIX + email); // OTP used → delete

  return true;
}
