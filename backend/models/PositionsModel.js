const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  product: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String },
  day: { type: String },
  isLoss: { type: Boolean },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

positionSchema.index({ userId: 1, name: 1, product: 1 }, { unique: true });

const PositionModel = mongoose.model("Position", positionSchema);

module.exports = { PositionModel };
