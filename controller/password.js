const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const User = require("../model/user");
const uuid = require("uuid");
const ForgetPassword = require("../model/forgetPasswordRequest");

exports.passwordforgetpage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "view", "password.html"));
};

exports.forgetpassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ where: { email: email } });
  const newId = uuid.v4();

  if (user) {
    let obj = await ForgetPassword.create({
      id: newId,
      isActive: true,
      userId: user.id,
      expireTime: 2,
    });
  } else {
    return res.status(500).json({
      message: "there is no accout with this mail address",
      success: false,
    });
  }

  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "cathrine.eichmann@ethereal.email",
      pass: "ZGcs1Uvmn7pqsz7W3d",
    },
  });

  const mailOptions = {
    from: '"vishal " <cathrine.eichmann@ethereal.email>',
    to: email,
    subject: "Hello",
    text: "nodemailer is awesome",
    html: `<a href="https://localhost:${process.env.PORT}/resetpassword/${newId}">click on this link to reset your password</a>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(500).json({ message: "cann not send mail", success: false });
    } else {
      res
        .status(200)
        .json({ message: "email sent successfully", success: true });
    }
  });
};
exports.reset = async (req, res) => {
  const id = req.params.token;
  ForgetPassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>

                                    <form action="/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

exports.update = async (req, res) => {
  try {
    const newpassword = req.query;
    const resetpasswordid = req.params.id;
    const resetPassword = await ForgetPassword.findOne({
      where: { id: resetpasswordid },
    });
    const pass = newpassword.newpassword;

    const user = await User.findOne({ where: { id: resetPassword.userId } });
    if (user) {
      const saltrounds = 10;
      const hashed = await bcrypt.hash(pass, saltrounds);
      const response = await User.update(
        { password: hashed },
        { where: { id: user.id } }
      );
      res.status(201).json({ message: "Successfuly update the new password" });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (err) {
    res.status(401).json({ message: "something wrong" });
  }
};
