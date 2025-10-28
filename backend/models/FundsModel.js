const mongoose = require("mongoose");

const fundsSchema = new mongoose.Schema({
  fundsAvilable: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

const fundsModel = mongoose.model("funds", fundsSchema);

module.exports = { fundsModel };

