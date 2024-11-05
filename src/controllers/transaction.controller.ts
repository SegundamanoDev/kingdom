import { Request, Response } from "express";
import { Transaction } from "../models/transaction.model";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
// POST /api/transaction/nfc - Create a new NFC transaction
export const createNfcTransaction = async (req: Request, res: Response) => {
  const { userId, walletId, amount, currency } = req.body;

  try {
    const transaction = await Transaction.create({
      userId,
      walletId,
      amount,
      currency,
      type: "nfc",
      status: "pending",
      reference: `NFC-${Date.now()}`,
    });

    res.status(201).json({ message: "NFC transaction created", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error creating NFC transaction", error });
  }
};

// POST /api/transaction/qr - Create a new QR code transaction
export const createQrTransaction = async (req: Request, res: Response) => {
  const { userId, walletId, amount, currency } = req.body;

  try {
    const transaction = await Transaction.create({
      userId,
      walletId,
      amount,
      currency,
      type: "qr",
      status: "pending",
      reference: `QR-${Date.now()}`,
    });

    res.status(201).json({ message: "QR transaction created", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error creating QR transaction", error });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      const transactions = await Transaction.findAll({
        where: { userId: user.id },
      });

      if (transactions.length === 0) {
        res
          .status(404)
          .json({ message: "No transactions found for this user." });
      } else {
        res.status(200).json({ transactions });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch transaction history", error });
    }
  }
};

// GET /api/transaction/:id - Fetch details of a specific transaction
export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
    } else {
      res.status(200).json({ transaction });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transaction details", error });
  }
};

// GET /api/transaction/history - Fetch a user's transaction history
export const getAllTransactionHistory = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.findAll();

    if (transactions.length === 0) {
      res.status(404).json({ message: "No transactions found" });
    } else {
      res.status(200).json({ transactions });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transaction history", error });
  }
};
