const userRepository = require("./user.repository");
const portfolioRepository = require("../portfolio/portfolio.repository");
const stockService = require("../stock/stock.service");
const AppError = require("../../utils/AppError");

class UserService {
  async getBalance(userId) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return { balance: user.balance };
  }

  async addBalance(userId, amount) {
    if (amount <= 0) {
      throw new AppError("Amount to add must be greater than zero", 400);
    }

    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

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

        const totalStockValue = holdingsWithStocks.reduce((total, holding) => {
      const stockPrice = holding.stockId?.price || 0;
      return total + (holding.quantity * stockPrice);
    }, 0);

    const currentNetWorth = user.balance + totalStockValue;
    const MAX_NET_WORTH = 1000000; 

    if (currentNetWorth >= MAX_NET_WORTH) {
      throw new AppError(
        `Simulator Cap Reached: Your total net worth ($${currentNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) is already at or above the $1,000,000 limit. Sell stocks to free up cash!`,
        400
      );
    }

    if (currentNetWorth + amount > MAX_NET_WORTH) {
      const maxAllowedToAdd = Math.max(0, MAX_NET_WORTH - currentNetWorth);
      throw new AppError(
        `Simulator Cap Reached: You can only add up to $${maxAllowedToAdd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} before exceeding the $1,000,000 total net worth cap (Cash + Stocks).`,
        400
      );
    }


        const updatedUser = await userRepository.updateUserBalance(userId, amount);
    if (!updatedUser) {
      throw new AppError("Paper trading accounts cannot exceed $1,000,000 in cash.", 400);
    }

    return { balance: updatedUser.balance };
  }
}

module.exports = new UserService();