const asyncWrapper = require("../../utils/asyncWrapper");
const { success } = require("../../utils/response");
const userService = require("./user.service");

exports.getBalance = asyncWrapper(async (req, res) => {
  const userId = req.user._id;

  const result = await userService.getBalance(userId);

  return success(res, result, "Balance fetched successfully", 200);
});

exports.addBalance = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const { amount } = req.body;

  const result = await userService.addBalance(userId, amount);

  return success(res, result, "Balance added successfully", 200);
});
