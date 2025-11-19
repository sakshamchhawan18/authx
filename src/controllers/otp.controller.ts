import { Request, Response } from "express";
import { asyncWrap } from "../middlewares/async-wrap";
import * as OtpService from "../services/otp.service";
import { prisma } from "../config/prisma";

export const sendOtpController = asyncWrap(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  const otp = await OtpService.generateOtp(email);

  console.log("OTP for", email, "=", otp); // Later integrate real email service.

  return res.json({ success: true, message: "OTP sent to email" });
});


export const verifyOtpController = asyncWrap(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ success: false, message: "Email and OTP required" });

  const valid = await OtpService.verifyOtp(email, otp);
  if (!valid)
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

  // Optional: mark user as verified
  await prisma.user.update({
    where: { email },
    data: { isVerified: true }
  });

  return res.json({ success: true, message: "OTP verified successfully" });
});
