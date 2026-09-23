const watchlistRepository = require('./watchlist.repository');
const stockService = require('../stock/stock.service');
const AppError = require('../../utils/AppError');

class WatchlistService {
  async getUserWatchlist(userId) {
    const watchlist = await watchlistRepository.getWatchlistByUserId(userId);
    
    const watchlistWithStocks = await Promise.all(
      watchlist.map(async (item) => {
        try {
          const stock = await stockService.getStockById(item.stockId);
          item.stockId = stock;
        } catch (error) {
          item.stockId = null;
        }
        return item;
      })
    );

    return watchlistWithStocks;
  }

  async addStock(userId, stockId) {
    const savedItem = await watchlistRepository.addStockToWatchlist(userId, stockId);
    return savedItem;
  }

  async removeStock(userId, stockId) {
    const deletedItem = await watchlistRepository.removeStockFromWatchlist(userId, stockId);
    
    if (!deletedItem) {
      throw new AppError('Stock not found in your watchlist', 404);
    }

    return deletedItem;
  }
}

module.exports = new WatchlistService();