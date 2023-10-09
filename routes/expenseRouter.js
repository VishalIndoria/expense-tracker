const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");

const expenseController = require("../controller/expenseController");
router.get("/add-expense", expenseController.getaddExpense);
router.post("/add-expense", authenticate, expenseController.postAddExpense);

router.get("/fetchData", authenticate, expenseController.fetchData);
router.post("/delete-expense", expenseController.deleteExpense);

router.get("/download", authenticate, expenseController.getDownload);
// router.get("/pagination", authenticate, expenseController.getExpenseOnPage);

module.exports = router;
