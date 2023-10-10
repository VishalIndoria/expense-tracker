const express = require("express");
const app = express();
require("dotenv").config(); // global configuration
const fs = require("fs");
const https = require("https");
const path = require("path");
const database = require("./connection/database");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// const helmet = require("helmet");
// app.use(helmet());

const compression = require("compression");
app.use(compression());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const morgan = require("morgan");
app.use(morgan("combined", { stream: accessLogStream }));

// ROUTES
const userRouter = require("./routes/user");
app.use(userRouter);

const expenseRouter = require("./routes/expenseRouter");
app.use(expenseRouter);

const purachseRouter = require("./routes/purchase");
app.use("/api", purachseRouter);

const premiumRouter = require("./routes/premiumFeature");
app.use(premiumRouter);

const passwordRouter = require("./routes/password");
app.use(passwordRouter);

// MODELS AND ASSOCIATIONS (RELATIONSHIP)

const user = require("./model/user");
const Expense = require("./model/expense");
const Order = require("./model/orders");
const ForgetPassword = require("./model/forgetPasswordRequest");
const fileUrl = require("./model/fileUrlTable");

user.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(user);

user.hasMany(Order);
Order.belongsTo(user);

user.hasMany(ForgetPassword);
ForgetPassword.belongsTo(user);

user.hasMany(fileUrl);
fileUrl.belongsTo(user);

// const sslServer = https.createServer({
//const key = fs.readFileSync(path.join(__dirname, "server.key"));/
//const certificate = fs.readFileSync(path.join(__dirname, "server.cert"));
// });

app.get("/test", (req, res) => {
  res.send("hello ec2 welcome ");
});

// DATABASE

database
  // .sync({ force: true })
  .sync({})
  .then(   app.listen(process.env.PORT)  )
    // https
    //   .createServer({ key: key, cert: certificate }, app)
  .catch((err) => {
    throw err;
  });
