const { PositionModel } = require("../models/PositionsModel.js");

exports.getAllPositions = async (req, res) => {
  try {
    const allPositions = await PositionModel.find({ userId: req.user._id });
    res.status(200).json(allPositions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching positions", error: error.message });
  }
};
