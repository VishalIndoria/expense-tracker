const Order = require("../model/orders");
const Razorpay = require("razorpay");
const user = require("../model/user");
const purchaseMemberShip = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await rzp.orders.create({ amount: 2500, currency: "INR" });
    //till now order is created
    const response = await Order.create({
      orderId: order.id,
      status: "PENDING",
      userdetailId: req.user.id,
      userId: req.user.id,
    });
    // console.log("response after insert data into te order table", response);
    res.status(201).json({ order, key_id: rzp.key_id });
  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: "something wrong" });
  }
};

const updatetransactionstatus = async (req, res) => {
  const { order_id, payment_id, payment_failed } = req.body;

  try {
    if (payment_failed === true) {
      const failure = await Order.update(
        { orderId: order_id, status: "fail" },
        { where: { userdetailId: req.user.id } }
      );

      // console.log("transaction status>>>>>>", failure);
      await user.update(
        { ispremiumuser: false },
        { where: { id: req.user.id } }
      );
      // console.log("transaction marked as failed due to payment failure");
    } else {
      const success = await Order.update(
        { paymentId: payment_id, orderId: order_id, status: "successful" },
        { where: { userdetailId: req.user.id } }
      );
      // console.log("update>>>>>>>>>>>>>", success);
      await user.update(
        { ispremiumuser: true },
        { where: { id: req.user.id } }
      );
      // req.user.update({})
      res.status(202).json({ sucess: true, message: "transaction successful" });
    }
  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: "something wrong" });
  }
};

module.exports = {
  purchaseMemberShip,
  updatetransactionstatus,
};
