const { HoldingsModel } = require("../../models/HoldingsModel");

class PortfolioRepository {
  async getHoldingsByUserId(userId) {
    return HoldingsModel.find({ userId }).lean();
  }

  async getHoldingByUserAndStock(userId, stockId, session = null) {
    return HoldingsModel.findOne({ userId, stockId }).session(session).lean();
  }

  async createHolding(holdingData, session = null) {
    const holding = new HoldingsModel(holdingData);
    return holding.save({ session });
  }

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

  async deleteHolding(holdingId, session = null) {
    return HoldingsModel.deleteOne({ _id: holdingId }).session(session);
  }
}

module.exports = new PortfolioRepository();