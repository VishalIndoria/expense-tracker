const Sequelize = require("sequelize");

const sequelize = require("../connection/database");
const fileUrls = sequelize.define("fileurl", {
  fileurl: {
    type: Sequelize.STRING,
    allownull: false,
  },
  userdetailId: {
    type: Sequelize.INTEGER,
    allownull: false,
  },
});

module.exports = fileUrls;
