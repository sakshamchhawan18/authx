"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.JWT_SECRET || "supersecretjwt";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refreshsupersecret";
// Parse "15m", "1h", "7d" → seconds
function parseExpiry(input) {
    if (typeof input === "number")
        return input;
    const match = input.match(/^(\d+)([smhd])$/);
    if (!match)
        throw new Error("Invalid expiresIn format");
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
function signAccessToken(payload, expiresIn = "15m") {
    const options = { expiresIn: parseExpiry(expiresIn) };
    return jsonwebtoken_1.default.sign(payload, ACCESS_SECRET, options);
}
function signRefreshToken(payload, jti, expiresIn = "30d") {
    const options = { expiresIn: parseExpiry(expiresIn) };
    return jsonwebtoken_1.default.sign({ ...payload, jti }, REFRESH_SECRET, options);
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
}
