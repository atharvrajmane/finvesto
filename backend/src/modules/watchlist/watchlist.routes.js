const express = require('express');
const passport = require('passport');
const watchlistController = require('./watchlist.controller');
const { addWatchlistRules, removeWatchlistRules, validate } = require('./watchlist.validator');

const router = express.Router();
const protect = passport.authenticate('jwt', { session: false });

router.get("/", protect, watchlistController.getWatchlist);
router.post("/", protect, addWatchlistRules, validate, watchlistController.addStockToWatchlist);
router.delete("/:stockId", protect, removeWatchlistRules, validate, watchlistController.deleteStockFromWatchlist);

module.exports = router;