import { Request, Response } from "express";
import { Op } from "sequelize";
import { Transaction } from "../models/transaction.model";
import User from "../models/user.model";
import Wallet from "../models/wallet.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
// POST /api/transaction/nfc - Create a new NFC transaction
export const createNfcTransaction = async (req: Request, res: Response) => {
  const { amount, currency } = req.body;

  const user = req.user;
  try {
    const transaction = await Transaction.create({
      userId: user?.id,
      amount,
      currency,
      type: "nfc",
      status: "pending",
      reference: `NFC-${Date.now()}`,
    });

    // Emit the new transaction event
    const io = req.app.get("socketio");
    io.emit("transactionCreated", transaction);
    return res
      .status(201)
      .json({ message: "NFC transaction created", transaction });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating NFC transaction", error });
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

    // Emit the new transaction event
    const io = req.app.get("socketio");
    io.emit("transactionCreated", transaction);
    return res
      .status(201)
      .json({ message: "QR transaction created", transaction });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating QR transaction", error });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      const transactions = await Transaction.findAll({
        where: { userId: user.id },
      });

      if (transactions.length === 0) {
        return res
          .status(404)
          .json({ message: "No transactions found for this user." });
      } else {
        return res.status(200).json({ transactions });
      }
    } catch (error) {
      return res
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
      return res.status(404).json({ message: "Transaction not found" });
    } else {
      return res.status(200).json({ transaction });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching transaction details", error });
  }
};

// GET /api/transaction/history - Fetch a user's transaction history
export const getAllTransactionHistory = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.findAll();

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    } else {
      return res.status(200).json({ transactions });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching transaction history", error });
  }
};

export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
    } else {
      transaction.status = status;
      await transaction.save();

      // Emit the status update event
      const io = req.app.get("socketio");
      io.emit("transactionStatusUpdated", transaction);

      return res
        .status(200)
        .json({ message: "Transaction status updated", transaction });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res
      .status(500)
      .json({ message: "Failed to update transaction status", error });
  }
};

export const filterTransaction = async (req: Request, res: Response) => {
  const user = req.user;
  const { type, startDate, endDate } = req.query;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    // Define filters
    let filters: any = { userId: user.id }; // Filtering by userId by default

    // Filter by type if provided
    if (type) {
      filters.type = type;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt[Op.gte] = new Date(startDate as string);
      }
      if (endDate) {
        filters.createdAt[Op.lte] = new Date(endDate as string);
      }
    }

    try {
      // Fetch transactions with the applied filters
      const transactions = await Transaction.findAll({ where: filters });

      if (!transactions.length) {
        return res.status(404).json({ message: "No transactions found" });
      } else {
        return res.status(200).json({ transactions });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to fetch transaction history", error });
    }
  }
};
