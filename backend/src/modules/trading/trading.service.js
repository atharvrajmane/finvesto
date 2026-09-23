const mongoose = require("mongoose");
const tradingRepository = require("./trading.repository");
const userRepository = require("../user/user.repository");
const portfolioRepository = require("../portfolio/portfolio.repository");
const stockService = require("../stock/stock.service");
const AppError = require("../../utils/AppError");

class TradingService {
  async getUserOrders(userId) {
    const orders = await tradingRepository.getOrdersByUser(userId);
    
    const ordersWithStocks = await Promise.all(
      orders.map(async (order) => {
        try {
          const stock = await stockService.getStockById(order.stockId);
          order.stockId = stock;
        } catch (error) {
          order.stockId = null;
        }
        return order;
      })
    );

    return ordersWithStocks;
  }

  async executeBuyOrder(userId, stockId, quantity) {
    // Validate Stock
    const stock = await stockService.getStockById(stockId);
    if (!stock) throw new AppError("Stock not found", 404);

    const STALE_THRESHOLD = 5 * 60 * 1000;
    const dataAge = new Date() - new Date(stock.lastPriceUpdatedAt);
    
    if (dataAge > STALE_THRESHOLD) {
      throw new AppError("Market data is temporarily delayed. Trading is paused to protect users.", 400);
    }

    const executionPrice = stock.price;
    const totalCost = executionPrice * quantity;

    // Validate User Balance
    const user = await userRepository.getUserById(userId);
    if (!user) throw new AppError("User not found", 404);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Deduct User Balance safely
      const updatedUser = await userRepository.updateUserBalance(
        userId,
        -totalCost,
        session
      );
      if (!updatedUser) throw new AppError("Insufficient balance", 400);

      // Update Portfolio
      let holding = await portfolioRepository.getHoldingByUserAndStock(
        userId,
        stockId,
        session
      );

      const POSITION_LIMIT = 1000;
      const currentShares = holding ? holding.quantity : 0;
      
      if (currentShares + quantity > POSITION_LIMIT) {
        throw new AppError(
          `Position Limit Exceeded: You cannot own more than ${POSITION_LIMIT} shares of a single stock.`, 
          400
        );
      }

      if (holding) {
        const oldQty = holding.quantity;
        const oldAvg = holding.averageBuyPrice || 0;
        const newQty = oldQty + quantity;
        const newAvg = (oldQty * oldAvg + quantity * executionPrice) / newQty;

        await portfolioRepository.updateHolding(
          userId,
          stockId,
          newQty,
          Number(newAvg.toFixed(2)),
          session
        );
      } else {
        await portfolioRepository.createHolding(
          {
            userId,
            stockId,
            quantity,
            averageBuyPrice: executionPrice,
          },
          session
        );
      }

      // Generate Permanent Order Receipt
      const savedOrder = await tradingRepository.createOrder(
        {
          userId,
          stockId,
          type: "BUY",
          quantity,
          priceAtExecution: executionPrice,
        },
        session
      );

      await session.commitTransaction();
      return savedOrder;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      throw new AppError("Trade execution failed due to a system error", 500);
    } finally {
      session.endSession();
    }
  }

  async executeSellOrder(userId, stockId, quantity) {
    // Validate Stock
    const stock = await stockService.getStockById(stockId);
    if (!stock) throw new AppError("Stock not found", 404);

    const STALE_THRESHOLD = 5 * 60 * 1000;
    const dataAge = new Date() - new Date(stock.lastPriceUpdatedAt);
    
    if (dataAge > STALE_THRESHOLD) {
      throw new AppError("Market data is temporarily delayed. Trading is paused to protect users.", 400);
    }

    const executionPrice = stock.price;
    const proceeds = executionPrice * quantity;



    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Validate Holding INSIDE transaction to prevent Double Spend Race Condition
      const holding = await portfolioRepository.getHoldingByUserAndStock(
        userId,
        stockId,
        session
      );
      if (!holding || holding.quantity < quantity) {
        throw new AppError("Insufficient shares to sell", 400);
      }

      // Add Proceeds to User Balance
      await userRepository.updateUserBalance(userId, proceeds, session);

      // Update Portfolio
      const newQty = holding.quantity - quantity;
      if (newQty > 0) {
        await portfolioRepository.updateHolding(
          userId,
          stockId,
          newQty,
          holding.averageBuyPrice,
          session
        );
      } else {
        await portfolioRepository.deleteHolding(holding._id, session);
      }

      // Generate Permanent Order Receipt
      const savedOrder = await tradingRepository.createOrder(
        {
          userId,
          stockId,
          type: "SELL",
          quantity,
          priceAtExecution: executionPrice,
        },
        session
      );

      await session.commitTransaction();
      return savedOrder;
    } catch (error) {
      await session.abortTransaction();
      console.error("RAW SELL SYSTEM ERROR:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Trade execution failed due to a system error", 500);
    } finally {
      session.endSession();
    }
  }
}

module.exports = new TradingService();