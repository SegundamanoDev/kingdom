import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  blockUserAccount,
} from "../controllers/user.controller";
import { jwtAuthentication } from "../middlewares/authmiddleware";
import { adminCheck } from "../middlewares/adminMiddleware";

const router = Router();

router.get("/user/:userId", jwtAuthentication, getUserProfile);
router.delete("/user/:userId", jwtAuthentication, adminCheck, deleteUser);
router.put("/user/:userId", jwtAuthentication, updateUserProfile);

router.put("/user/change-password", jwtAuthentication, requestPasswordReset);
router.put("/user/reset-password/:token", jwtAuthentication, resetPassword);
router.put("/user/block/:id", jwtAuthentication, adminCheck, blockUserAccount);
export default router;
