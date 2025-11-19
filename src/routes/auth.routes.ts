// src/routes/auth.routes.ts
import { Router } from "express";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller";
import { registerController, loginController, refreshController, logoutController } from "../controllers/auth.controller";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/login", rateLimiter(), loginController);
router.post("/refresh", rateLimiter({ max: 20, window: 60 }), refreshController);
router.post("/register", rateLimiter({ max: 5, window: 60 }), registerController);router.post("/logout", logoutController);
router.post("/send-otp", rateLimiter({ max: 3, window: 60 }), sendOtpController);
router.post("/verify-otp", rateLimiter({ max: 5, window: 60 }), verifyOtpController);



export default router;
