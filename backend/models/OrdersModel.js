const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderType: { type: String, required: true },
  stockName: { type: String, required: true },
  AveragePrice: { type: Number, required: true },
  qty: { type: Number, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const OrdersModel = mongoose.model("Order", orderSchema);

module.exports = { OrdersModel };
