import express, { RequestHandler } from "express";
import { requestOTP, verifyOTP } from "../controllers/twoFactor";
import authenticateToken from "../middlewares/authmiddleware";

const router = express.Router();

// Request OTP (requires user to be authenticated)
router.post(
  "/auth/2fa/request-otp",
  authenticateToken as unknown as RequestHandler,
  requestOTP as unknown as RequestHandler
);

// Verify OTP (requires user to be authenticated)
router.post(
  "/2fa/verify-otp",
  authenticateToken as unknown as RequestHandler,
  verifyOTP as unknown as RequestHandler
);

export default router;
