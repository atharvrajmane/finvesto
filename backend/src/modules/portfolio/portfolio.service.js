const portfolioRepository = require("./portfolio.repository");
const stockService = require("../stock/stock.service");
const AppError = require("../../utils/AppError");

class PortfolioService {
  async getUserPortfolio(userId) {
    const holdings = await portfolioRepository.getHoldingsByUserId(userId);
    
    const holdingsWithStocks = await Promise.all(
      holdings.map(async (holding) => {
        try {
          const stock = await stockService.getStockById(holding.stockId);
          holding.stockId = stock;
        } catch (error) {
          holding.stockId = null;
        }
        return holding;
      })
    );

    return holdingsWithStocks;
  }

  async getStockQuantity(userId, stockId) {
    const holding = await portfolioRepository.getHoldingByUserAndStock(
      userId,
      stockId
    );

    if (!holding) {
      return { stockId, quantity: 0 };
    }

    return { stockId, quantity: holding.quantity };
  }
}

module.exports = new PortfolioService();
