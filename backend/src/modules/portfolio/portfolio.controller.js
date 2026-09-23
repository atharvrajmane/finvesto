const portfolioService = require("./portfolio.service");
const asyncWrapper = require("../../utils/asyncWrapper");
const { success } = require("../../utils/response");

exports.getPortfolio = asyncWrapper(async (req, res) => {
  const userId = req.user._id;

  const portfolio = await portfolioService.getUserPortfolio(userId);

  return success(res, portfolio, "Portfolio fetched successfully", 200);
});

exports.getHoldingQuantity = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { stockId } = req.params;

  const result = await portfolioService.getStockQuantity(userId, stockId);

  return success(res, result, "Holding quantity fetched successfully", 200);
});
