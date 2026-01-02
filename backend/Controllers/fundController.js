const { fundsModel } = require("../models/FundsModel.js");
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');
const { success } = require('../utils/response');

exports.getFunds = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const funds = await fundsModel.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return success(res, funds, 'Funds fetched', 200);
});

exports.addFunds = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const amountRaw = req.body.funds ?? req.body.amount;
  const amount = Number(amountRaw);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('Invalid funds amount. Provide a positive number in "funds" or "amount".', 422);
  }

  const updatedFunds = await fundsModel.findOneAndUpdate(
    { userId },
    {
      $inc: { fundsAvilable: amount },
      $setOnInsert: { userId }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return success(res, updatedFunds, 'Funds added successfully', 200);
});
