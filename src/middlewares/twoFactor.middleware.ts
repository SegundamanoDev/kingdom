import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// middleware To verify2FA
export const verify2FA = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.twoFactorAuth) {
    next();
  } else {
    res.status(403).json({ message: "2FA verification required" });
  }
};
