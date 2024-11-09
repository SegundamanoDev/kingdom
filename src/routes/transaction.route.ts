import express, { RequestHandler } from "express";
import {
  createNfcTransaction,
  createQrTransaction,
  getTransactionHistory,
  getTransactionById,
  getAllTransactionHistory,
  filterTransaction,
} from "../controllers/transaction.controller";
import authenticateToken from "../middlewares/authmiddleware";
import { adminCheck } from "../middlewares/adminMiddleware";

const router = express.Router();

// Route to create an NFC transaction
router.post(
  "/nfc",
  authenticateToken as unknown as RequestHandler,
  createNfcTransaction as unknown as RequestHandler
);

// Route to create a QR transaction
router.post(
  "/qr",
  authenticateToken as unknown as RequestHandler,
  createQrTransaction as unknown as RequestHandler
);

// Route to get transaction history for a user
router.get(
  "/user-history",
  authenticateToken as unknown as RequestHandler,
  getTransactionHistory as unknown as RequestHandler
);

// Route to get transaction historys
router.get(
  "/all-history",
  authenticateToken as unknown as RequestHandler,
  // adminCheck,
  getAllTransactionHistory as unknown as RequestHandler
);

// Route to get details of a specific transaction
router.get(
  "/:id",
  authenticateToken as unknown as RequestHandler,
  getTransactionById as unknown as RequestHandler
);

router.get(
  "/filter",
  authenticateToken as unknown as RequestHandler,
  filterTransaction as unknown as RequestHandler
);

export default router;
