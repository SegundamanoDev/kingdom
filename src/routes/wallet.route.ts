import { Router } from "express";
import {
  getBalance,
  topUpWallet,
  withdrawFromWallet,
} from "../controllers/wallet.controller";
import { jwtAuthentication } from "../middlewares/authmiddleware";

const router = Router();

router.get("/wallet/:userId/balance", jwtAuthentication, getBalance);
router.post("/wallet/:userId/topup", jwtAuthentication, topUpWallet);
router.post("/wallet/:userId/withdraw", jwtAuthentication, withdrawFromWallet);

export default router;
