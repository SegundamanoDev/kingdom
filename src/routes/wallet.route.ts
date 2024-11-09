import { RequestHandler, Router } from "express";
import {
  getBalance,
  getWalletDetails,
  topUpWallet,
  withdrawFromWallet,
} from "../controllers/wallet.controller";
import authenticateToken from "../middlewares/authmiddleware";

const router = Router();

router.get(
  "/balance/:userId",
  authenticateToken as unknown as RequestHandler,
  getBalance as unknown as RequestHandler
);
router.get(
  "/details/:userId",
  authenticateToken as unknown as RequestHandler,
  getWalletDetails as unknown as RequestHandler
);
router.post(
  "/:userId/topup",
  authenticateToken as unknown as RequestHandler,
  topUpWallet as unknown as RequestHandler
);
router.post(
  "/:userId/withdraw",
  authenticateToken as unknown as RequestHandler,
  withdrawFromWallet as unknown as RequestHandler
);

export default router;
