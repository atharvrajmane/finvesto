const { HoldingsModel } = require("../../models/HoldingsModel");

class PortfolioRepository {
  async getHoldingsByUserId(userId) {
    return HoldingsModel.find({ userId }).lean();
  }

  // 2. Get a specific holding
  async getHoldingByUserAndStock(userId, stockId, session = null) {
    return HoldingsModel.findOne({ userId, stockId }).session(session).lean();
  }

  // 3. Create a brand new holding
  async createHolding(holdingData, session = null) {
    const holding = new HoldingsModel(holdingData);
    return holding.save({ session });
  }

  // 4. Update an existing holding's quantity and average price
  async updateHolding(
    userId,
    stockId,
    newQuantity,
    newAvgPrice,
    session = null
  ) {
    return HoldingsModel.findOneAndUpdate(
      { userId, stockId },
      { $set: { quantity: newQuantity, averageBuyPrice: newAvgPrice } },
      { new: true, session }
    ).lean();
  }

  // 5. Delete a holding (used when a user sells all their shares of a stock)
  async deleteHolding(holdingId, session = null) {
    return HoldingsModel.deleteOne({ _id: holdingId }).session(session);
  }
}

module.exports = new PortfolioRepository();