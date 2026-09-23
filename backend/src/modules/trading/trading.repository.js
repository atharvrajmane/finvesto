const { OrdersModel } = require("../../models/OrdersModel");

class TradingRepository {
  async getOrdersByUser(userId) {
    return OrdersModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async createOrder(orderData, session = null) {
    const order = new OrdersModel(orderData);
    return order.save({ session });
  }
}

module.exports = new TradingRepository();
