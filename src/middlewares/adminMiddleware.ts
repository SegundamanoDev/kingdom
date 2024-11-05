import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
export const adminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: " User not found" });
  } else {
    if (!user.isAdmin) {
      res.status(401).json({ message: " Admin access require" });
    }

    next();
  }
};
