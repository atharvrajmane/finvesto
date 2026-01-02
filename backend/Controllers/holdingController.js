const { HoldingsModel } = require("../models/HoldingsModel");

const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/AppError");
const { success } = require("../utils/response");

/**
 * @desc    Get all holdings for logged-in user
 * @route   GET /api/holdings
 * @access  Private
 */
exports.getAllHoldings = asyncWrapper(async (req, res) => {
  const allHoldings = await HoldingsModel.find({ userId: req.user._id });
  return success(res, allHoldings, "Holdings fetched successfully");
});

/**
 * @desc    Update holding price and net value
 * @route   POST /api/holdings/update
 * @access  Private
 */
exports.updateHolding = asyncWrapper(async (req, res) => {
  const { name, price, net } = req.body;

  const updatedHolding = await HoldingsModel.findOneAndUpdate(
    { name: name, userId: req.user._id },
    { $set: { price: price, net: net } },
    { new: true }
  );

  if (!updatedHolding) {
    throw new AppError("Holding not found for this user", 404);
  }

  return success(res, updatedHolding, "Holding updated successfully");
});

/**
 * @desc    Get available quantity for a holding
 * @route   POST /api/holdings/quantity
 * @access  Private
 */
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
