const express = require("express");
const Controller = require("../controller/premiumFeature.js");

const authenticate = require("../middleware/auth");

const router = express.Router();

router.get("/leaderboard", authenticate, Controller.getUserLeaderBoard);
router.get("/leader", Controller.leader);
router.get("/report", Controller.getReport);

// router.get("/dailyreports", Controller.dailyReports);
// router.get("/monthlyReports", Controller.monthlyReports);

router.post("/dailyreports", authenticate, Controller.dailyReports);
router.post("/monthlyReports", authenticate, Controller.monthlyReports);
// router.get("/getleader", Controller.getleader);

module.exports = router;
