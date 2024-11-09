import { Request, Response } from "express";
import Wallet from "../models/wallet.model";

export const getBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const wallet = await Wallet.findOne({ where: { userId } });

    if (wallet) {
      return res.status(200).json({ balance: wallet.balance });
    } else {
      return res.status(404).json({ message: "Wallet not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching balance", error });
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
      return res.status(200).json({
        message: `${amount} ${wallet.currency} was added to your wallet`,
        balance: wallet.balance,
      });
    } else {
      return res.status(404).json({ message: "Wallet not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error topping up wallet", error });
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
        return res.status(200).json({
          message: `${amount} ${wallet.currency} has been deducted from your wallet`,
          balance: wallet.balance,
        });
      } else {
        return res.status(400).json({ message: "Insufficient balance" });
      }
    } else {
      return res.status(404).json({ message: "Wallet not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error processing withdrawal", error });
  }
};

export const getWalletDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(userId);

    const wallet = await Wallet.findOne({ where: { userId } });
    console.log(wallet);
    if (!wallet) {
      return res.status(404).json({ message: "No wallet found for this user" });
    } else {
      res.status(200).json(wallet);
    }
  } catch (error) {
    console.error(error);
  }
};
