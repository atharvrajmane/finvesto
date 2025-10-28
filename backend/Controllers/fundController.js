const { fundsModel } = require("../models/FundsModel.js");

exports.getFunds = async (req, res) => {
  try {
    const funds = await fundsModel.findOneAndUpdate(
      { userId: req.user._id },
      { $setOnInsert: { userId: req.user._id } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(funds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching funds", error: error.message });
  }
};

exports.addFunds = async (req, res) => {
  try {
    const { funds } = req.body;
    if (isNaN(funds) || funds <= 0) {
      return res.status(400).json({ message: "Invalid funds amount." });
    }

    const updatedFunds = await fundsModel.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $inc: { fundsAvilable: Number(funds) },
        $setOnInsert: { userId: req.user._id }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res
      .status(200)
      .json({ message: "Funds added successfully", data: updatedFunds });
  } catch (error) {
    res.status(500).json({ message: "Error adding funds", error: error.message });
  }
};

