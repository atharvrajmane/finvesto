const { HoldingsModel } = require('../models/HoldingsModel.js');
const { HoldingsData } = require('../init/HoldingsData.js');
const { PositionsData } = require("../init/PositionsData.js");
const { PositionModel } = require('../models/PositionsModel.js');
const { WatchListData } = require('../init/WatchListData.js');
const { WatchlistModel } = require('../models/WatchlistModel.js');
const { OrdersModel } = require('../models/OrdersModel.js');
const { fundsModel } = require('../models/FundsModel.js');
const User = require('../models/UserModel'); 

const TEST_USERNAME = "seed_user";

const getTestUserId = async () => {
    const user = await User.findOne({ username: TEST_USERNAME });
    if (!user) {
        throw new Error(`Test user "${TEST_USERNAME}" not found. Please create this user first.`);
    }
    return user._id;
};

const addUserIdToData = (data, userId) => {
    return data.map(item => ({ ...item, userId }));
};

exports.seedHoldings = async (req, res) => {
    try {
        const userId = await getTestUserId();
        await HoldingsModel.deleteMany({ userId: userId });
        const holdingsWithUser = addUserIdToData(HoldingsData, userId);
        await HoldingsModel.insertMany(holdingsWithUser);
        res.status(200).json({ message: `Holdings data seeded successfully for user ${TEST_USERNAME}` });
    } catch (error) {
        console.error("Error seeding holdings:", error);
        res.status(500).json({ message: "Error seeding holdings data", error: error.message });
    }
};

exports.seedPositions = async (req, res) => {
    try {
        const userId = await getTestUserId();
        await PositionModel.deleteMany({ userId: userId });
        const positionsWithUser = addUserIdToData(PositionsData, userId);
        await PositionModel.insertMany(positionsWithUser);
        res.status(200).json({ message: `Positions data seeded successfully for user ${TEST_USERNAME}` });
    } catch (error) {
        console.error("Error seeding positions:", error);
        res.status(500).json({ message: "Error seeding positions data", error: error.message });
    }
};

exports.seedWatchlist = async (req, res) => {
    try {
        const userId = await getTestUserId();
        await WatchlistModel.deleteMany({ userId: userId });
        const watchlistWithUser = addUserIdToData(WatchListData, userId);
        await WatchlistModel.insertMany(watchlistWithUser);
        res.status(200).json({ message: `Watchlist data seeded successfully for user ${TEST_USERNAME}` });
    } catch (error) {
        console.error("Error seeding watchlist:", error);
        res.status(500).json({ message: "Error seeding watchlist data", error: error.message });
    }
};

exports.seedOrders = async (req, res) => {
    try {
        const userId = await getTestUserId();
        await OrdersModel.deleteMany({ userId: userId });
        const placedOrders = [
            { orderType: "BUY", stockName: "INFY", AveragePrice: 1500, qty: 1, userId: userId },
            { orderType: "SELL", stockName: "TCS", AveragePrice: 3500, qty: 1, userId: userId }
        ];
        await OrdersModel.insertMany(placedOrders);
        res.status(200).json({ message: `Orders data seeded successfully for user ${TEST_USERNAME}` });
    } catch (error) {
        console.error("Error seeding orders:", error);
        res.status(500).json({ message: "Error seeding orders data", error: error.message });
    }
};

exports.seedFunds = async (req, res) => {
     try {
        const userId = await getTestUserId();
        await fundsModel.updateOne(
            { userId: userId },
            { $set: { fundsAvilable: 100000, userId: userId } },
            { upsert: true }
        );
        res.status(200).json({ message: `Initial funds seeded successfully for user ${TEST_USERNAME}` });
    } catch (error) {
         console.error("Error seeding funds:", error);
        res.status(500).json({ message: "Error seeding funds data", error: error.message });
    }
};
