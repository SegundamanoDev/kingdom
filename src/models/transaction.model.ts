import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export interface TransactionAttribute {
  transactionId?: string;
  userId: number | undefined;
  walletId?: string;
  amount: number;
  currency: string;
  type?: "nfc" | "qr" | "top-up" | "withdraw";
  status?: "pending" | "completed" | "failed";
  reference?: string;
  description?: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

// TransactionModel class extending Sequelize Model
export class Transaction
  extends Model<TransactionAttribute>
  implements TransactionAttribute
{
  transactionId!: string;
  userId!: number;
  walletId!: string;
  amount!: number;
  currency!: string;
  type!: "nfc" | "qr" | "top-up" | "withdraw";
  status!: "pending" | "completed" | "failed";
  reference!: string;
  description?: string;
  timestamp?: Date;
  metadata!: Record<string, unknown>;
}

// Initialize the Transaction model with the new fields
Transaction.init(
  {
    transactionId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    walletId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("nfc", "qr", "top-up", "withdraw"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
    timestamps: true,
  }
);
