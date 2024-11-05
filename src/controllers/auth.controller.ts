import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary";
import Wallet from "../models/wallet.model";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const register = async (req: Request, res: Response) => {
  const { email, password, name, phone, image } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  let imageUrl = "";

  try {
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "segun",
        resource_type: "image",
      });
      imageUrl = uploadResponse.secure_url;
    }
    // Create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      image: imageUrl,
      biometricEnabled: false,
      twoFactorAuth: false,
      isConfirmed: false,
      isAdmin: false,
      isBlocked: false,
    });

    //create a wallet for the new user
    await Wallet.create({
      walletId: `wallet_${newUser.id}`,
      userId: newUser.id,
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    const confirmationUrl = `http://localhost:3000/api/auth/confirm/${token}`;

    await transporter.sendMail({
      to: newUser.email,
      subject: "Confirm your email",
      html: `<p>Welcome to the fintech platform, ${newUser.name}! Please confirm your email by clicking <a href="${confirmationUrl}">here</a>.</p>`,
    });

    res.status(201).json({
      message:
        "User registered successfully, please check your email to confirm.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const confirmEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      user.isConfirmed = true;
      await user.save();

      res.status(200).json({ message: "Email confirmed successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error confirming email", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
      } else {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });

        res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            isConfirmed: user.isConfirmed,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};