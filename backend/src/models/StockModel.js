const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    lastPriceUpdatedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const StockModel = mongoose.model("Stock", stockSchema);

module.exports = {StockModel};
