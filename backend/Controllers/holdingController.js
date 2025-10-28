const { HoldingsModel } = require("../models/HoldingsModel.js");

exports.getAllHoldings = async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({ userId: req.user._id });
    res.status(200).json(allHoldings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching holdings", error: error.message });
  }
};

exports.updateHolding = async (req, res) => {
  try {
    const { name, price, net } = req.body;
    const updatedHolding = await HoldingsModel.findOneAndUpdate(
      { name: name, userId: req.user._id },
      { $set: { price: price, net: net } },
      { new: true }
    );

    if (!updatedHolding) {
      return res.status(404).json({ message: "Holding not found for this user" });
    }
    res.status(200).json({ message: "Holding updated successfully", data: updatedHolding });
  } catch (error) {
    res.status(500).json({ message: "Error updating holding", error: error.message });
  }
};

exports.getAvailableQty = async (req, res) => {
  try {
    const { name } = req.body;
    const holding = await HoldingsModel.findOne({ name: name, userId: req.user._id });

    if (!holding) {
      return res.status(404).json({ message: "Holding not found for this user" });
    }
    res.status(200).json({ name: holding.name, qty: holding.qty });
  } catch (error) {
    res.status(500).json({ message: "Error fetching holding quantity", error: error.message });
  }
};
