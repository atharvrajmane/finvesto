const watchlistService = require("./watchlist.service");
const asyncWrapper = require("../../utils/asyncWrapper");
const { success } = require("../../utils/response");

exports.getWatchlist = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const watchlist = await watchlistService.getUserWatchlist(userId);
  return success(res, watchlist, "Watchlist fetched successfully", 200);
});

exports.addStockToWatchlist = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { stockId } = req.body;

  const savedStock = await watchlistService.addStock(userId, stockId);
  return success(res, savedStock, "Stock added to watchlist", 201);
});

exports.deleteStockFromWatchlist = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { stockId } = req.params;

  const deletedStock = await watchlistService.removeStock(userId, stockId);
  return success(res, deletedStock, "Stock removed from watchlist", 200);
});
