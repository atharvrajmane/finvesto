const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
      
    },
    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    priceAtExecution: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

const OrdersModel = mongoose.model("Order", orderSchema);

module.exports = { OrdersModel };
