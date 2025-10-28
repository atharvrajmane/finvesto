const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String },
  day: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create a compound index to ensure a user can only have one document per stock name.
holdingSchema.index({ userId: 1, name: 1 }, { unique: true });

const HoldingsModel = mongoose.model("Holding", holdingSchema);

module.exports = { HoldingsModel };
