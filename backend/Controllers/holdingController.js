const { HoldingsModel } = require("../models/HoldingsModel");

const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/AppError");
const { success } = require("../utils/response");

exports.getAllHoldings = asyncWrapper(async (req, res) => {
  const allHoldings = await HoldingsModel.find({ userId: req.user._id });
  return success(res, allHoldings, "Holdings fetched successfully");
});

exports.getAvailableQty = asyncWrapper(async (req, res) => {
  const { name } = req.body;

  const holding = await HoldingsModel.findOne({
    name: name,
    userId: req.user._id,
  });

  if (!holding) {
    throw new AppError("Holding not found for this user", 404);
  }

  return success(
    res,
    { name: holding.name, qty: holding.qty },
    "Holding quantity fetched successfully"
  );
});
