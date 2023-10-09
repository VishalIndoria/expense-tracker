const Sequelize = require("sequelize");
const sequelize = require("../connection/database");

//id, name , password, phone number, role

const Forgotpassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isActive: Sequelize.BOOLEAN,
  expireTime: Sequelize.DATE,
});

module.exports = Forgotpassword;
