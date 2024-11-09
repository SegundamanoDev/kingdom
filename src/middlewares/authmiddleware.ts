import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: User;
}

interface DecodedToken {
  userId: string;
}

const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error("JWT_SECRET not defined");
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    if (typeof decoded === "object" && "userId" in decoded) {
      const userId = (decoded as DecodedToken).userId;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticateToken;
