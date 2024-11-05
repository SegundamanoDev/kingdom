import { Request, Response } from "express";
import Wallet from "../models/wallet.model";

export const getBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const wallet = await Wallet.findOne({ where: { userId } });

    if (wallet) {
      res.status(200).json({ balance: wallet.balance });
    } else {
      res.status(404).json({ message: "Wallet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching balance", error });
  }
};

export const topUpWallet = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    const wallet = await Wallet.findOne({ where: { userId } });

    if (wallet) {
      wallet.balance += amount;
      await wallet.save();
      res.status(200).json({
        message: "Wallet topped up successfully",
        balance: wallet.balance,
      });
    } else {
      res.status(404).json({ message: "Wallet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error topping up wallet", error });
  }
};

export const withdrawFromWallet = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    const wallet = await Wallet.findOne({ where: { userId } });

    if (wallet) {
      if (wallet.balance >= amount) {
        wallet.balance -= amount;
        await wallet.save();
        res
          .status(200)
          .json({ message: "Withdrawal successful", balance: wallet.balance });
      } else {
        res.status(400).json({ message: "Insufficient balance" });
      }
    } else {
      res.status(404).json({ message: "Wallet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing withdrawal", error });
  }
};
