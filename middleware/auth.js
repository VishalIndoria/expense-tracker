const jwt = require("jsonwebtoken");
const User = require("../model/user");

async function userauthenticate(req, res, next) {
  try {
    const token = req.header("Authorization");
    console.log("AUTH VALA TOKEN-----------------", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized users" });
    }
    const user = jwt.verify(token, "secret");
    //output of this above line is  { userId: 2, iat: 1692093001 }
    // console.log("userId>>>>>>", user.id);
    // console.log("user.userid >>>>>>>>>", user.id);

    const responseUser = await User.findByPk(user.id);
    // console.log("responseUserId>>>>>>", responseUser.id);
    try {
      req.user = responseUser;
      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "primary key not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Token is not valid" });
  }
}

module.exports = userauthenticate;
