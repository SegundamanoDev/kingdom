import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const jwtAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: " Invalid or no token" });
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = (await User.findByPk(decoded.id)) as User;

    if (!user) {
      res.status(401).json({ message: " User not found" });
    }

    req.user = user;

    next();
  }
};
