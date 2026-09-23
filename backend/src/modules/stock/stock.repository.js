const { StockModel } = require("../../models/StockModel");

class StockRepository {
  async getAllStocks() {
    return StockModel.find({}).lean();
  }

  async getStockById(stockId, session = null) {
    return StockModel.findById(stockId).session(session).lean();
  }

  async updateAvailableQuantity(stockId, amount, session = null) {
    return StockModel.findByIdAndUpdate(
      stockId,
      { $inc: { availableQuantity: amount } },
      { new: true, session }
    ).lean();
  }
}

module.exports = new StockRepository();
