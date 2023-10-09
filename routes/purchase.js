const express = require("express");
const router = express.Router();

const purchaseController = require("../controller/purchase.js");
const authenticate = require("../middleware/auth.js");

router.get(
  "/purchaseMember",
  authenticate,
  purchaseController.purchaseMemberShip
);
router.post(
  "/updatetransactionstatus",
  authenticate,
  purchaseController.updatetransactionstatus
);
// router.route("/update").post(purchaseController.purchaseMemberShip);

module.exports = router;
