const mongoose = require('mongoose'); // add if not already present
const { OrdersModel } = require("../models/OrdersModel.js");
const { HoldingsModel } = require("../models/HoldingsModel.js");
const { fundsModel } = require("../models/FundsModel.js");

// Helper
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

exports.getAllOrders = async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: allOrders });
  } catch (error) {
    console.error('getAllOrders error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};

exports.placeBuyOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { stockName, qty, AveragePrice } = req.body;
    const userId = req.user._id;

    // Validate input
    const price = toNumber(AveragePrice);
    const quantity = toNumber(qty);
    if (!stockName || typeof stockName !== 'string' || price <= 0 || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid input: stockName, qty and AveragePrice are required and must be positive.' });
    }

    const cost = price * quantity;

    // Pre-flight: check funds quickly to fail fast
    const fundsDoc = await fundsModel.findOne({ userId }).lean();
    if (!fundsDoc || (fundsDoc.fundsAvilable ?? 0) < cost) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }

    // Start transaction
    session.startTransaction();
    try {
      // 1) create order inside session
      const orderData = new OrdersModel({ ...req.body, userId });
      const savedOrder = await orderData.save({ session });

      // 2) update or create holding inside session (read then write)
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

      // 3) atomically decrement funds inside transaction
      // Use findOneAndUpdate with session; since we are inside a transaction, we don't strictly
      // need the conditional filter here, but it's an extra safety check:
      const updatedFunds = await fundsModel.findOneAndUpdate(
        { userId, fundsAvilable: { $gte: cost } },
        { $inc: { fundsAvilable: -cost } },
        { new: true, session }
      );

      if (!updatedFunds) {
        // Not enough funds at the moment of applying changes -> abort
        throw new Error('Insufficient funds during transaction');
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({ success: true, message: 'Buy order placed successfully!', data: savedOrder });
    } catch (txErr) {
      await session.abortTransaction();
      session.endSession();
      console.error('placeBuyOrder transaction aborted:', txErr);
      return res.status(500).json({ success: false, message: 'Failed to place buy order', error: txErr.message });
    }
  } catch (err) {
    console.error('placeBuyOrder error:', err);
    // If session is still active, end it
    try { session.endSession(); } catch (e) {}
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.placeSellOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { stockName, qty, AveragePrice } = req.body;
    const userId = req.user._id;

    // Validate input
    const price = toNumber(AveragePrice);
    const quantity = toNumber(qty);
    if (!stockName || typeof stockName !== 'string' || price <= 0 || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid input: stockName, qty and AveragePrice are required and must be positive.' });
    }

    // Pre-flight: ensure holding exists and has enough quantity
    const holding = await HoldingsModel.findOne({ name: stockName, userId }).lean();
    if (!holding || Number(holding.qty) < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient quantity to sell.' });
    }

    const proceeds = price * quantity;

    // Start transaction
    session.startTransaction();
    try {
      // 1) create order inside session
      const orderData = new OrdersModel({ ...req.body, userId });
      const savedOrder = await orderData.save({ session });

      // 2) re-read holding inside session and update
      const holdingInside = await HoldingsModel.findOne({ name: stockName, userId }).session(session);
      if (!holdingInside || Number(holdingInside.qty) < quantity) {
        throw new Error('Holding not found or insufficient qty inside transaction');
      }

      const newQty = Number(holdingInside.qty) - quantity;
      if (newQty > 0) {
        holdingInside.qty = newQty;
        holdingInside.net = Number(holdingInside.avg || 0) * newQty;
        await holdingInside.save({ session });
      } else {
        // remove holding if zero
        await HoldingsModel.deleteOne({ _id: holdingInside._id }).session(session);
      }

      // 3) increment funds
      const updatedFunds = await fundsModel.findOneAndUpdate(
        { userId },
        { $inc: { fundsAvilable: proceeds } },
        { new: true, session }
      );

      if (!updatedFunds) {
        throw new Error('Funds document missing during sell transaction');
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({ success: true, message: 'Sell order placed successfully!', data: savedOrder });
    } catch (txErr) {
      await session.abortTransaction();
      session.endSession();
      console.error('placeSellOrder transaction aborted:', txErr);
      return res.status(500).json({ success: false, message: 'Failed to place sell order', error: txErr.message });
    }
  } catch (err) {
    console.error('placeSellOrder error:', err);
    try { session.endSession(); } catch (e) {}
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
