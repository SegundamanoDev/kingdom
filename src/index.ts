import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import transactionRoutes from "./routes/transaction.route";
import walletRoutes from "./routes/wallet.route";
import { sequelize } from "./db";

// Load environment variables
dotenv.config();

// Create an express application
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/wallet", walletRoutes);

// Start the server and synchronize the database
const PORT = process.env.PORT || 5000;
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database models synchronized");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Unable to sync the database:", error);
  });
