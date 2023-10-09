const express = require("express");
const router = express.Router();
const controller = require("../controller/password");

router.get("/passwordforgetpage", controller.passwordforgetpage);
router.post("/password/forgetpassword", controller.forgetpassword);
router.get("/resetpassword/:token", controller.reset);
router.use("/updatepassword/:id", controller.update);
module.exports = router;
