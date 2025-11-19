// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { asyncWrap } from "../middlewares/async-wrap";
import * as SessionService from "../services/session.service";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/jwt";

const { v4: uuidv4 } = require("uuid");

export const registerController = asyncWrap(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

export const loginController = asyncWrap(async (req: Request, res: Response) => {
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
export const refreshController = asyncWrap(async (req: Request, res: Response) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.body.refreshToken ||
    req.headers["x-refresh-token"];

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "No refresh token provided" });
  }

  let payload: any;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
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
  const newRefreshToken = signRefreshToken(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role
    },
    newJti
  );

  const REFRESH_TTL = Number(process.env.REFRESH_TOKEN_EXPIRES_IN || 60 * 60 * 24 * 30);
  await SessionService.storeRefreshToken(newJti, userId, REFRESH_TTL);

  // New access token
  const newAccessToken = signAccessToken({
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
export const logoutController = asyncWrap(async (req: Request, res: Response) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.body.refreshToken ||
    req.headers["x-refresh-token"];

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "No refresh token provided" });
  }

  let payload: any;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid refresh token" });
  }

  const jti = payload.jti;
  await SessionService.revokeRefreshToken(jti);

  return res.json({ success: true, message: "Logged out" });
});
