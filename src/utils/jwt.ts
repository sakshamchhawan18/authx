import jwt, { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.JWT_SECRET || "supersecretjwt";
const REFRESH_SECRET: Secret = process.env.REFRESH_SECRET || "refreshsupersecret";

// Parse "15m", "1h", "7d" → seconds
function parseExpiry(input: string | number): number {
  if (typeof input === "number") return input;

  const match = input.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error("Invalid expiresIn format");

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s": return value;
    case "m": return value * 60;
    case "h": return value * 3600;
    case "d": return value * 86400;
    default: throw new Error("Invalid expiry format");
  }
}

export interface AccessPayload {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

export function signAccessToken(
  payload: AccessPayload,
  expiresIn: string | number = "15m"
): string {
  const options: SignOptions = { expiresIn: parseExpiry(expiresIn) };
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function signRefreshToken(
  payload: object,
  jti: string,
  expiresIn: string | number = "30d"
): string {
  const options: SignOptions = { expiresIn: parseExpiry(expiresIn) };
  return jwt.sign({ ...payload, jti }, REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
