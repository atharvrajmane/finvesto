const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    avg: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

holdingSchema.index({ userId: 1, name: 1 }, { unique: true });

const HoldingsModel = mongoose.model("Holding", holdingSchema);

module.exports = { HoldingsModel };
