// src/routes/otp.routes.ts
import { Router } from "express";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/send-otp", rateLimiter({ max: 3, window: 60 }), sendOtpController);
router.post("/verify-otp", rateLimiter({ max: 5, window: 60 }), verifyOtpController);


export default router;
