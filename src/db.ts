import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME!, // Database name
  process.env.DB_USER!, // Database username
  process.env.DB_PASSWORD!, // Database password
  {
    host: process.env.DB_HOST, // Database host (e.g., 'localhost')
    dialect: "mysql", // Database dialect
    port: Number(process.env.DB_PORT) || 3306, // MySQL port (default is 3306)
    logging: false, // Disable SQL query logging
  }
);

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
