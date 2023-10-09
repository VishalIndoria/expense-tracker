const path = require("path");
const AWS = require("aws-sdk");
const User = require("../model/user");
const expenseModel = require("../model/expense");
const sequelize = require("../connection/database");
const authenticate = require("../middleware/auth");
const fileUrls = require("../model/fileUrlTable");

// expenses routes
exports.getaddExpense = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "view", "expense.html"));
};

exports.postAddExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, description, category, datee } = req.body;
    if (amount == undefined || amount.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Parameters missing" });
    }
    await User.update(
      { totalExpenses: req.user.totalExpenses + Number(amount) },
      { where: { id: req.user.id } },
      { transaction: t }
    );
    const response = await expenseModel.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id,
        date: datee,
        authenticate,
      },
      {
        transaction: t,
      }
    );

    res.status(200).json({ expense: response });
    await t.commit();
    await t.rollback();
  } catch {
    async (err) => {
      await t.rollback();
      throw err;
    };
  }
};

exports.fetchData = async (req, res, next) => {
  try {
    const response = await req.user.getExpenses();
    res.status(200).json(response);
  } catch (err) {
    res.status(401).json({ sucess: false, message: "some error occured" });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.body.obj_id;
    const result = await expenseModel.destroy({ where: { id: id } });
    res.status(200).json({ result, message: "deleted successfully" });
  } catch (err) {
    res.status(401).json({ message: "something went wrong" });
  }
};

async function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  const AWS_REGION = "us-east-1";

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    // Buket: BUCKET_NAME,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL:'public-read',
    
  };
  try {
    const s3response = await s3bucket.upload(params).promise();
    return s3response.Location;
  } catch (err) {
    res.status(401).json({ message: "something wrong" });
  }
}
exports.getDownload = async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expense/${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpenses, filename);
    let obj = {
      userdetailId: req.user.id,
      fileurl: fileUrl,
      userId: req.user.id,
    };

    const f = await fileUrls.create(obj);
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    res.status(401).json({ message: "something went wrong" });
  }
};

exports.allfileUrl = async (req, res, next) => {
  try {
    let listOfUrl = await fileUrls.find({
      where: { userdetailId: req.user.id },
    });
    res.json(listOfUrl);
  } catch (error) {
    throw error;
  }
};
