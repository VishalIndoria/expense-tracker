const Sequelize = require("sequelize");
const sequelize = require("../connection/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allownull: false,
    primaryKey: true,
  },
  paymentId: Sequelize.STRING,
  orderId: Sequelize.STRING,
  status: Sequelize.STRING,
  userdetailId: Sequelize.INTEGER,
});

module.exports = Order;
// Order.sync({ force: true });
