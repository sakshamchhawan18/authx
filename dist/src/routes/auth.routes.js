"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const otp_controller_1 = require("../controllers/otp.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const router = (0, express_1.Router)();
router.post("/login", (0, rateLimiter_middleware_1.rateLimiter)(), auth_controller_1.loginController);
router.post("/refresh", (0, rateLimiter_middleware_1.rateLimiter)({ max: 20, window: 60 }), auth_controller_1.refreshController);
router.post("/register", (0, rateLimiter_middleware_1.rateLimiter)({ max: 5, window: 60 }), auth_controller_1.registerController);
router.post("/logout", auth_controller_1.logoutController);
router.post("/send-otp", (0, rateLimiter_middleware_1.rateLimiter)({ max: 3, window: 60 }), otp_controller_1.sendOtpController);
router.post("/verify-otp", (0, rateLimiter_middleware_1.rateLimiter)({ max: 5, window: 60 }), otp_controller_1.verifyOtpController);
exports.default = router;
