const { WatchlistModel } = require("../../models/WatchListModel");

class WatchlistRepository {
  async getWatchlistByUserId(userId) {
    return WatchlistModel.find({ userId }).lean();
  }

  async addStockToWatchlist(userId, stockId) {
    const newWatchlistItem = new WatchlistModel({ userId, stockId });
    return newWatchlistItem.save();
  }

  async removeStockFromWatchlist(userId, stockId) {
    return WatchlistModel.findOneAndDelete({ userId, stockId }).lean();
  }
}

module.exports = new WatchlistRepository();
