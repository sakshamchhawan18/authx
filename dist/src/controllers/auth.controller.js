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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.refreshController = exports.loginController = exports.registerController = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const async_wrap_1 = require("../middlewares/async-wrap");
const SessionService = __importStar(require("../services/session.service"));
const jwt_1 = require("../utils/jwt");
const { v4: uuidv4 } = require("uuid");
exports.registerController = (0, async_wrap_1.asyncWrap)(async (req, res) => {
    const result = await AuthService.register(req.body);
    res.status(201).json({ success: true, data: result });
});
exports.loginController = (0, async_wrap_1.asyncWrap)(async (req, res) => {
    const result = await AuthService.login(req.body);
    res.status(200).json({
        success: true,
        data: {
            token: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        }
    });
});
// Refresh endpoint — rotation
exports.refreshController = (0, async_wrap_1.asyncWrap)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken ||
        req.body.refreshToken ||
        req.headers["x-refresh-token"];
    if (!refreshToken) {
        return res.status(400).json({ success: false, message: "No refresh token provided" });
    }
    let payload;
    try {
        payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
    const jti = payload.jti;
    const userId = await SessionService.getUserIdByRefreshJti(jti);
    if (!userId) {
        return res.status(401).json({ success: false, message: "Refresh token revoked or not found" });
    }
    // Rotate refresh tokens
    await SessionService.revokeRefreshToken(jti);
    const newJti = uuidv4();
    const newRefreshToken = (0, jwt_1.signRefreshToken)({
        id: payload.id,
        email: payload.email,
        role: payload.role
    }, newJti);
    const REFRESH_TTL = Number(process.env.REFRESH_TOKEN_EXPIRES_IN || 60 * 60 * 24 * 30);
    await SessionService.storeRefreshToken(newJti, userId, REFRESH_TTL);
    // New access token
    const newAccessToken = (0, jwt_1.signAccessToken)({
        id: payload.id,
        email: payload.email,
        role: payload.role
    });
    return res.json({
        success: true,
        data: {
            token: newAccessToken,
            refreshToken: newRefreshToken
        }
    });
});
// Logout — revoke refresh token
exports.logoutController = (0, async_wrap_1.asyncWrap)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken ||
        req.body.refreshToken ||
        req.headers["x-refresh-token"];
    if (!refreshToken) {
        return res.status(400).json({ success: false, message: "No refresh token provided" });
    }
    let payload;
    try {
        payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    }
    catch (err) {
        return res.status(400).json({ success: false, message: "Invalid refresh token" });
    }
    const jti = payload.jti;
    await SessionService.revokeRefreshToken(jti);
    return res.json({ success: true, message: "Logged out" });
});
