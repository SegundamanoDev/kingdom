import { Request, Response } from "express";
// import { Op } from "sequelize";
import User from "../models/user.model";
// import crypto from "crypto";
// import { sendEmail } from "../utils/sendEmail";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// export const requestPasswordReset = async (req: Request, res: Response) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     } else {
//       // Generate reset token
//       const resetToken = crypto.randomBytes(32).toString("hex");
//       const resetPasswordToken = crypto
//         .createHash("sha256")
//         .update(resetToken)
//         .digest("hex");

//       // Set token and expiration time (1 hour from now)
//       user.resetPasswordToken = resetPasswordToken;
//       user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

//       await user.save();

//       // Send reset link via email
//       const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//       const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;

//       await sendEmail({
//         email: user.email,
//         subject: "Password Reset Request",
//         message,
//       });

//       return res
//         .status(200)
//         .json({ message: "Password reset link sent to email" });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error requesting password reset", error });
//   }
// };

// export const resetPassword = async (req: Request, res: Response) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   try {
//     // Hash the token to match with the database stored hashed token
//     const resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");

//     // Find the user by token and check if token has expired
//     const user = await User.findOne({
//       where: {
//         resetPasswordToken,
//         resetPasswordExpires: { [Op.gt]: Date.now() },
//       },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     } else {
//       // Hash new password
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(newPassword, salt);

//       // Clear reset token and expiry fields
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpires = undefined;

//       await user.save();

//       return res.status(200).json({ message: "Password successfully reset" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error resetting password", error });
//   }
// };

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(400).json({ message: "No users" });
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log(req.user);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({
        message: "User profile fetched successfully",
        user,
      });
    }
  } catch (error) {}
};

// Update User Profile
export const updateUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, phone, password, image } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      // Handle image update if provided
      if (image) {
        // If there's an existing image URL, delete it from Cloudinary
        if (user.image) {
          const publicId = user.image.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(publicId!);
        }
        const uploadResponse = await cloudinary.uploader.upload(image, {
          upload_preset: "segun",
          resource_type: "image",
        });
        user.image = uploadResponse.secure_url;
      }

      await user.save();
      return res
        .status(200)
        .json({ message: "User profile updated successfully", user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user profile", error });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (user) {
      // Delete user's image from Cloudinary if exists
      if (user.image) {
        const publicId = user.image.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(publicId!);
      }
      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error });
  }
};

export const blockUserAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the requesting user is an admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    } else {
      // Find the user by ID
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      } else {
        // Block the user by setting an isBlocked flag
        user.isBlocked = true;
        await user.save();

        return res
          .status(200)
          .json({ message: "User account blocked successfully." });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to block user account" });
  }
};
