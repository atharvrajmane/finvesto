const mongoose = require('mongoose');
const { OrdersModel } = require("../models/OrdersModel.js");
const { HoldingsModel } = require("../models/HoldingsModel.js");
const { fundsModel } = require("../models/FundsModel.js");

const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');
const { success } = require('../utils/response');

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}


exports.getAllOrders = asyncWrapper(async (req, res) => {
  const allOrders = await OrdersModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return success(res, allOrders, 'Orders fetched', 200);
});

exports.placeBuyOrder = asyncWrapper(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { stockName, qty, AveragePrice } = req.body;
    const userId = req.user._id;

    const price = toNumber(AveragePrice);
    const quantity = toNumber(qty);
    if (!stockName || typeof stockName !== 'string' || price <= 0 || quantity <= 0) {
      throw new AppError('Invalid input: stockName, qty and AveragePrice are required and must be positive.', 422);
    }

    const cost = price * quantity;

    const fundsDoc = await fundsModel.findOne({ userId }).lean();
    if (!fundsDoc || (fundsDoc.fundsAvilable ?? 0) < cost) {
      throw new AppError('Insufficient funds', 400);
    }

    session.startTransaction();
    let savedOrder;
    try {
      const orderData = new OrdersModel({ ...req.body, userId });
      savedOrder = await orderData.save({ session });

      const existing = await HoldingsModel.findOne({ name: stockName, userId }).session(session);

      if (existing) {
        const existingQty = Number(existing.qty);
        const existingAvg = Number(existing.avg || 0);
        const newQty = existingQty + quantity;
        const newAvg = ((existingAvg * existingQty) + (price * quantity)) / newQty;
        const roundedAvg = Number(newAvg.toFixed(2));
        existing.qty = newQty;
        existing.avg = roundedAvg;
        existing.price = price;
        existing.net = roundedAvg * newQty;
        await existing.save({ session });
      } else {
        const newHolding = new HoldingsModel({
          name: stockName,
          qty: quantity,
          avg: price,
          price,
          net: price * quantity,
          day: 0,
          userId
        });
        await newHolding.save({ session });
      }

      const updatedFunds = await fundsModel.findOneAndUpdate(
        { userId, fundsAvilable: { $gte: cost } },
        { $inc: { fundsAvilable: -cost } },
        { new: true, session }
      );

      if (!updatedFunds) {
        throw new AppError('Insufficient funds during transaction', 400);
      }

      await session.commitTransaction();
      return success(res, savedOrder, 'Buy order placed successfully!', 201);
    } catch (txErr) {
      try { await session.abortTransaction(); } catch (e) { console.error('abortTransaction failed', e); }
      if (txErr instanceof AppError) throw txErr;
      throw new AppError(txErr.message || 'Failed to place buy order', 500);
    }
  } finally {
    try { session.endSession(); } catch (e) { /* ignore */ }
  }
});

exports.placeSellOrder = asyncWrapper(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { stockName, qty, AveragePrice } = req.body;
    const userId = req.user._id;

    const price = toNumber(AveragePrice);
    const quantity = toNumber(qty);
    if (!stockName || typeof stockName !== 'string' || price <= 0 || quantity <= 0) {
      throw new AppError('Invalid input: stockName, qty and AveragePrice are required and must be positive.', 422);
    }

    const holding = await HoldingsModel.findOne({ name: stockName, userId }).lean();
    if (!holding || Number(holding.qty) < quantity) {
      throw new AppError('Insufficient quantity to sell.', 400);
    }

    const proceeds = price * quantity;

    session.startTransaction();
    let savedOrder;
    try {
      const orderData = new OrdersModel({ ...req.body, userId });
      savedOrder = await orderData.save({ session });

      const holdingInside = await HoldingsModel.findOne({ name: stockName, userId }).session(session);
      if (!holdingInside || Number(holdingInside.qty) < quantity) {
        throw new AppError('Holding not found or insufficient qty inside transaction', 400);
      }

      const newQty = Number(holdingInside.qty) - quantity;
      if (newQty > 0) {
        holdingInside.qty = newQty;
        holdingInside.net = Number(holdingInside.avg || 0) * newQty;
        await holdingInside.save({ session });
      } else {
        await HoldingsModel.deleteOne({ _id: holdingInside._id }).session(session);
      }

      const updatedFunds = await fundsModel.findOneAndUpdate(
        { userId },
        { $inc: { fundsAvilable: proceeds } },
        { new: true, session }
      );

      if (!updatedFunds) {
        throw new AppError('Funds document missing during sell transaction', 500);
      }

      await session.commitTransaction();
      return success(res, savedOrder, 'Sell order placed successfully!', 201);
    } catch (txErr) {
      try { await session.abortTransaction(); } catch (e) { console.error('abortTransaction failed', e); }
      if (txErr instanceof AppError) throw txErr;
      throw new AppError(txErr.message || 'Failed to place sell order', 500);
    }
  } finally {
    try { session.endSession(); } catch (e) {  }
  }
});
