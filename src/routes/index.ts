import { Router } from "express";
import authRoutes from "./auth.routes";
import otpRoutes from "./otp.routes";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.use("/auth", authRoutes);
router.use("/auth/otp", otpRoutes);
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Protected content" });
});

export default router;
