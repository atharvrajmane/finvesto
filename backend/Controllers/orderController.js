const { OrdersModel } = require("../models/OrdersModel.js");
const { HoldingsModel } = require("../models/HoldingsModel.js");
const { fundsModel } = require("../models/FundsModel.js");

exports.getAllOrders = async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

exports.placeBuyOrder = async (req, res) => {
  try {
    const { stockName, qty, AveragePrice } = req.body;
    const userId = req.user._id;

    const orderData = new OrdersModel({ ...req.body, userId });
    const savedOrder = await orderData.save();

    const existing = await HoldingsModel.findOne({ name: stockName, userId });

    let updatedAvg = AveragePrice; 
    if (existing) {
      const totalQty = existing.qty + Number(qty);
      updatedAvg = ((existing.avg * existing.qty) + (AveragePrice * qty)) / totalQty;
      updatedAvg = Number(updatedAvg.toFixed(2));
    }

    await HoldingsModel.findOneAndUpdate(
      { name: stockName, userId },
      {
        $inc: { qty: Number(qty) },  
        $set: {
          name: stockName,
          price: AveragePrice,
          avg: updatedAvg,            
        },
        $setOnInsert: { userId }
      },
      { upsert: true, new: true }
    );

    const cost = Number(qty) * Number(AveragePrice);
    await fundsModel.updateOne({ userId }, { $inc: { fundsAvilable: -cost } });

    res.status(201).json({ message: "Buy order placed successfully!", data: savedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing buy order", error: error.message });
  }
};


exports.placeSellOrder = async (req, res) => {
  try {
    const { stockName, qty, AveragePrice } = req.body;
    const userId = req.user._id;

    const holding = await HoldingsModel.findOne({ name: stockName, userId: userId });
    if (!holding || holding.qty < Number(qty)) {
      return res.status(400).json({ message: "Insufficient quantity to sell." });
    }

    const orderData = new OrdersModel({ ...req.body, userId });
    const savedOrder = await orderData.save();

    const updatedHolding = await HoldingsModel.findOneAndUpdate(
      { name: stockName, userId: userId },
      { $inc: { qty: -Number(qty) } },
      { new: true }
    );

    if (updatedHolding && updatedHolding.qty <= 0) {
      await HoldingsModel.deleteOne({ name: stockName, userId: userId });
    }

    const proceeds = Number(qty) * Number(AveragePrice);
    await fundsModel.updateOne({ userId: userId }, { $inc: { fundsAvilable: proceeds } });

    res.status(201).json({ message: "Sell order placed successfully!", data: savedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing sell order", error: error.message });
  }
};

