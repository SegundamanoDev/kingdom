import { RequestHandler, Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  // requestPasswordReset,
  // resetPassword,
  blockUserAccount,
  getUsers,
} from "../controllers/user.controller";

import { adminCheck } from "../middlewares/adminMiddleware";
import authenticateToken from "../middlewares/authmiddleware";

const router = Router();

router.get(
  "/:userId",
  authenticateToken as unknown as RequestHandler,
  // adminCheck,
  getUserProfile as unknown as RequestHandler
);
router.delete(
  "/:userId",
  // authenticateToken,
  //  adminCheck,
  deleteUser as unknown as RequestHandler
);
router.put(
  "/update-user/:userId",
  authenticateToken as unknown as RequestHandler,
  updateUserProfile as unknown as RequestHandler
);
router.get("/users", getUsers as unknown as RequestHandler);

// router.put(
//   "/change-password",
//   //  authenticateToken as unknown as RequestHandler,
//   requestPasswordReset as unknown as RequestHandler
// );
// router.put(
//   "/user/reset-password/:token",
//   authenticateToken as unknown as RequestHandler,
//   resetPassword as unknown as RequestHandler
// );
router.put(
  "/user/block/:id",
  authenticateToken as unknown as RequestHandler,
  adminCheck,
  blockUserAccount as unknown as RequestHandler
);
export default router;
