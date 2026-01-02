const { WatchlistModel } = require("../models/WatchlistModel");

const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/AppError");
const { success } = require("../utils/response");

exports.getWatchlist = asyncWrapper(async (req, res) => {
  const watchlist = await WatchlistModel.find({ userId: req.user._id });
  return success(res, watchlist, "Watchlist fetched successfully");
});

exports.addStockToWatchlist = asyncWrapper(async (req, res) => {
  const { stockName } = req.body;
  const userId = req.user._id;

  if (!stockName) {
    throw new AppError("Stock name is required", 400);
  }

  const newStock = new WatchlistModel({ stockName, userId });
  const savedStock = await newStock.save();

  return success(res, savedStock, "Stock added to watchlist", 201);
});

exports.deleteStockFromWatchlist = asyncWrapper(async (req, res) => {
  const { stockName } = req.body;
  const userId = req.user._id;

  if (!stockName) {
    throw new AppError("Stock name is required", 400);
  }

  const deletedStock = await WatchlistModel.findOneAndDelete({
    stockName: stockName,
    userId: userId,
  });

  if (!deletedStock) {
    throw new AppError("Stock not found in your watchlist", 404);
  }

  return success(res, deletedStock, "Stock removed from watchlist");
});
