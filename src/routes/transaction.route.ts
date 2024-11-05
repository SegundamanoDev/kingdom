import express from "express";
import {
  createNfcTransaction,
  createQrTransaction,
  getTransactionHistory,
  getTransactionById,
  getAllTransactionHistory,
} from "../controllers/transaction.controller";
import { jwtAuthentication } from "../middlewares/authmiddleware";
import { adminCheck } from "../middlewares/adminMiddleware";

const router = express.Router();

// Route to create an NFC transaction
router.post("/nfc", jwtAuthentication, createNfcTransaction);

// Route to create a QR transaction
router.post("/qr", jwtAuthentication, createQrTransaction);

// Route to get transaction history for a user
router.get("/user-history", jwtAuthentication, getTransactionHistory);

// Route to get transaction historys
router.get(
  "/admin-history",
  jwtAuthentication,
  adminCheck,
  getAllTransactionHistory
);

// Route to get details of a specific transaction
router.get("/:id", jwtAuthentication, getTransactionById);

export default router;
