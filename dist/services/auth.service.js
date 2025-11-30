"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
// src/services/auth.service.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../utils/jwt");
const { v4: uuidv4 } = require("uuid");
const SessionService = __importStar(require("./session.service"));
const SALT_ROUNDS = 10;
const REFRESH_TTL = Number(process.env.REFRESH_TOKEN_EXPIRES_IN || 60 * 60 * 24 * 30 // 30 days
);
async function register(payload) {
    const { email, password } = payload;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing) {
        const err = new Error("User already exists");
        err.status = 400;
        throw err;
    }
    const passwordHash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    // role defaults to USER
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            passwordHash,
            role: payload.role || "USER"
        },
        select: { id: true, email: true, role: true, createdAt: true }
    });
    return { user };
}
async function login(payload) {
    const { email, password } = payload;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }
    const match = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!match) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }
    // 👇 Include RBAC role in JWT payload
    const accessToken = (0, jwt_1.signAccessToken)({
        id: user.id,
        email: user.email,
        role: user.role
    });
    const jti = uuidv4();
    const refreshToken = (0, jwt_1.signRefreshToken)({
        id: user.id,
        email: user.email,
        role: user.role
    }, jti);
    // Store refresh token in Redis
    await SessionService.storeRefreshToken(jti, user.id, REFRESH_TTL);
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    };
}
