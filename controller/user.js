const userModel = require("../model/user");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

exports.getsignIn = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "view", "signin.html"));
};

const jwt = require("jsonwebtoken");

// POST REQUEST
// getsignIn,postsignUp,postsignIn
exports.postsignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await userModel.findOne({ where: { email: email } });
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required details" });
    }
    if (existUser)
      return res.status(400).json({ message: "user already exist" });
    else {
      const saltrounds = 10;
      const hashed = await bcrypt.hash(password, saltrounds);

      await userModel.create({ name, email, password: hashed });
      return res.status(200).json({ message: "user registered successfully" });
      // }
    }
  } catch (err) {
    // console.log(err);
    res.status(401).json({ message: "something went wrong" });
  }
};

function generateAccessToken(id, email, ispremiumuser) {
  return jwt.sign({ id: id, email: email, ispremiumuser }, "secret");
}

exports.postsignIn = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);

  try {
    const existUser = await userModel.findOne({ where: { email: email } });

    if (!email || !password) {
      return res.status(400).json({ message: "provide all the info" });
    }
    if (!existUser) {
      return res.status(400).json({ message: "Email is not registered" });
    }
    const ispasswordValid = await bcrypt.compare(password, existUser.password);

    if (!ispasswordValid) {
      return res.status(400).json({ message: "Password is Invalid" });
    } else {
      const token = generateAccessToken(
        existUser.id,
        existUser.email,
        existUser.ispremiumuser
      );
      // console.log(token);
      res.status(201).json({
        message: "user login successfully",
        user: existUser,
        token: token,
      });
    }
  } catch (err) {
    // console.log(err);
    res.status(401).json({ message: "something went wrong" });
  }
};
