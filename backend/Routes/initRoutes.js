const express = require("express");
const router = express.Router();
const initController = require("../Controllers/initController.js");

router.get("/holdings", initController.seedHoldings);
router.get("/positions", initController.seedPositions);
router.get("/watchlist", initController.seedWatchlist);
router.get("/orders", initController.seedOrders);
router.get("/funds", initController.seedFunds);

module.exports = router;
