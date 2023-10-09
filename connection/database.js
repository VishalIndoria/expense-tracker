// require()
// require("dotenv").config(); // global configuration

const sequelize = require("sequelize");

const database = new sequelize(
  process.env.DB_NAME,
  // "exp",
  process.env.DB_USER,
  // "root",
  // "root",
  process.env.DB_PASS,

  {
    dialect: "mysql",
    host: process.env.HOST_NAME,
  }
);

module.exports = database;
