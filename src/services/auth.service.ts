// src/services/auth.service.ts
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
const { v4: uuidv4 } = require("uuid");

import * as SessionService from "./session.service";

const SALT_ROUNDS = 10;
const REFRESH_TTL = Number(
  process.env.REFRESH_TOKEN_EXPIRES_IN || 60 * 60 * 24 * 30 // 30 days
);

type RegisterDTO = { email: string; password: string; role?: "USER" | "ADMIN" };
type LoginDTO = { email: string; password: string };

export async function register(payload: RegisterDTO) {
  const { email, password } = payload;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err: any = new Error("User already exists");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // role defaults to USER
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: payload.role || "USER"
    },
    select: { id: true, email: true, role: true, createdAt: true }
  });

  return { user };
}

export async function login(payload: LoginDTO) {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 👇 Include RBAC role in JWT payload
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  const jti = uuidv4();

  const refreshToken = signRefreshToken(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    jti
  );

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
