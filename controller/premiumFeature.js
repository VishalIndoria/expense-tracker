const path = require("path");
const User = require("../model/user");
const Expense = require("../model/expense");
const sequelize = require("../connection/database");
const { Op } = require("sequelize");

const getUserLeaderBoard = async (req, res) => {
  try {
    const userLeaderBoardData = await User.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("SUM", sequelize.col("expenses.amount")), "total_cost"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["user.id"],
      order: [["total_cost", "DESC"]],
    });
    res.status(200).json(userLeaderBoardData);
  } catch (err) {
    res.status(500).json(err);
  }
};

const leader = async (req, res) => {
  res.sendFile(path.join(__dirname, "../", "view", "leader.html"));
};
const getReport = async (req, res) => {
  res.sendFile(path.join(__dirname, "../", "view", "report.html"));
};

const dailyReports = async (req, res, next) => {
  try {
    const id = req.user.id;
    console.log(id);
    const date = req.body.date;
    const expenses = await Expense.findAll({
      where: { date: date, userId: id },
    });
    // return res.send(expenses);
    res.status(200).send(expenses);
  } catch (error) {
    console.log(error);
  }
};

const monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;
    console.log("month>>>>>>>>>>>", month);
    const expenses = await Expense.findAll({
      where: {
        date: { [Op.like]: `%/${month}/%` },
        userId: req.user.id,
      },
      raw: true,
    });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserLeaderBoard,
  leader,
  getReport,
  dailyReports,
  monthlyReports,
  dailyReports,
  monthlyReports,
};
