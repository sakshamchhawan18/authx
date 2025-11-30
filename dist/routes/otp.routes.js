"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/otp.routes.ts
const express_1 = require("express");
const otp_controller_1 = require("../controllers/otp.controller");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const router = (0, express_1.Router)();
router.post("/send-otp", (0, rateLimiter_middleware_1.rateLimiter)({ max: 3, window: 60 }), otp_controller_1.sendOtpController);
router.post("/verify-otp", (0, rateLimiter_middleware_1.rateLimiter)({ max: 5, window: 60 }), otp_controller_1.verifyOtpController);
exports.default = router;
