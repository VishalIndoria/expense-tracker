const Sequelize = require("sequelize");

const sequelize = require("../connection/database");

const Expense = sequelize.define("expense", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: Sequelize.INTEGER,
  description: Sequelize.STRING,
  category: Sequelize.STRING,
  date: Sequelize.STRING,
});

module.exports = Expense;
