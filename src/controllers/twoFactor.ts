import { Request, Response } from "express";
import speakeasy from "speakeasy";
import { sendEmail } from "../utils/sendEmail";

// Store OTPs in-memory or in a Redis store for production
const otpStore: { [userId: string]: { otp: string; expiry: number } } = {};

// Request OTP for 2FA
export const requestOTP = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      // Generate a 6-digit OTP
      const otp = speakeasy.totp({
        secret: process.env.OTP_SECRET || "secret",
        encoding: "base32",
      });

      // Set expiry time (e.g., 5 minutes from now)
      const expiry = Date.now() + 5 * 60 * 1000;

      // Save OTP and expiry to otpStore
      otpStore[user.id] = { otp, expiry };

      // Send OTP to user's email
      await sendEmail({
        email: user.email,
        subject: "Your OTP for 2FA",
        message: `Your one-time password (OTP) is: ${otp}. It expires in 5 minutes.`,
      });

      return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }
  }
};

// Verify OTP for 2FA
export const verifyOTP = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const userOTP = otpStore[user.id];

    if (!userOTP) {
      return res.status(400).json({ message: "OTP not requested or expired" });
    }

    // Check if OTP is correct and has not expired
    if (userOTP.otp === otp && userOTP.expiry > Date.now()) {
      // Clear the OTP from store after successful verification
      delete otpStore[user.id];
      return res.status(200).json({ message: "2FA successful" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  }
};
