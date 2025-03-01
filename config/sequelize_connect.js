const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERS, // Fixed typo from USERS to USER
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT, // Ensure your .env file has the correct dialect
    port: process.env.DB_PORT,
    timezone: "Asia/Bangkok",
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false, // Add this option for SSL validation (use caution in production)
    //     ca: process.env.SSLROOTCERT, // Ensure this variable points to the correct certificate file
    //   },
    // },
    
    logging: false,
    
    
  }
);

module.exports = sequelize;
