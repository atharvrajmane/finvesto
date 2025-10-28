const express = require('express');
const router = express.Router();
const passport = require('passport');
const watchlistController = require('../Controllers/watchlistController.js');

const protect = passport.authenticate('jwt', { session: false });

router.get("/", protect, watchlistController.getWatchlist);
router.post("/", protect, watchlistController.addStockToWatchlist);
router.delete("/", protect, watchlistController.deleteStockFromWatchlist);

module.exports = router;