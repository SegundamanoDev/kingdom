import { Model, Optional } from "sequelize";
import User from "./user.model";
import { DataTypes } from "sequelize";
import { sequelize } from "../db";

interface WalletAttributes {
  walletId: string;
  userId: number;
  balance: number;
  currency: string;
  status: "active" | "suspended";
}

export interface WalletCreationAttributes
  extends Optional<
    WalletAttributes,
    "walletId" | "balance" | "currency" | "status"
  > {}

class Wallet
  extends Model<WalletAttributes, WalletCreationAttributes>
  implements WalletAttributes
{
  walletId!: string;
  userId!: number;
  balance!: number;
  currency!: string;
  status!: "active" | "suspended";
}

Wallet.init(
  {
    walletId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "USD",
    },
    status: {
      type: DataTypes.ENUM("active", "suspended"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

// Association
User.hasOne(Wallet, { foreignKey: "userId" });
Wallet.belongsTo(User, { foreignKey: "userId" });

export default Wallet;
