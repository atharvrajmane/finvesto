const { WatchlistModel } = require("../models/WatchlistModel.js");

exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await WatchlistModel.find({ userId: req.user._id });
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching watchlist", error: error.message });
  }
};

exports.addStockToWatchlist = async (req, res) => {
  try {
    const { stockName } = req.body;
    const userId = req.user._id;

    const newStock = new WatchlistModel({ stockName, userId });
    const savedStock = await newStock.save();
    res.status(201).json({ message: "Stock added to watchlist", data: savedStock });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Stock is already in your watchlist." });
    }
    res.status(500).json({ message: "Error adding stock to watchlist", error: error.message });
  }
};

exports.deleteStockFromWatchlist = async (req, res) => {
  try {
    const { stockName } = req.body;
    const userId = req.user._id;

    const deletedStock = await WatchlistModel.findOneAndDelete({
      stockName: stockName,
      userId: userId,
    });

    if (!deletedStock) {
      return res.status(404).json({ message: "Stock not found in your watchlist" });
    }
    res.status(200).json({ message: "Stock removed from watchlist", data: deletedStock });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock from watchlist", error: error.message });
  }
};
