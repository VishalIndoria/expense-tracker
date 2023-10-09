const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const userController = require("../controller/user")

// SIGN IN
router.get("/", userController.getsignIn);
router.post("/", userController.postsignIn);

// SIGN UP
router.post("/signup", userController.postsignUp);

module.exports = router;
