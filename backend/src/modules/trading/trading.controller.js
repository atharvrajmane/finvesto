const tradingService = require('./trading.service');
const asyncWrapper = require('../../utils/asyncWrapper');
const { success } = require('../../utils/response');

exports.getAllOrders = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const orders = await tradingService.getUserOrders(userId);
  return success(res, orders, 'Orders fetched successfully', 200);
});

exports.placeBuyOrder = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { stockId, quantity } = req.body; 

  const result = await tradingService.executeBuyOrder(userId, stockId, quantity);
  return success(res, result, 'Buy order executed successfully', 201);
});

exports.placeSellOrder = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { stockId, quantity } = req.body;

  const result = await tradingService.executeSellOrder(userId, stockId, quantity);
  return success(res, result, 'Sell order executed successfully', 201);
});