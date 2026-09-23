const stockService = require("./stock.service");
const asyncWrapper = require("../../utils/asyncWrapper");
const { success } = require("../../utils/response");

exports.getAllStocks = asyncWrapper(async (req, res) => {
  const stocks = await stockService.getAllStocks();
  return success(res, stocks, "Market data fetched successfully", 200);
});

exports.getStockById = asyncWrapper(async (req, res) => {
  const { stockId } = req.params;
  const stock = await stockService.getStockById(stockId);
  return success(res, stock, "Stock fetched successfully", 200);
});
