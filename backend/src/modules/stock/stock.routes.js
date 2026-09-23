const express = require('express');
const passport = require('passport');
const stockController = require('./stock.controller');

const router = express.Router();

const protect = passport.authenticate('jwt', { session: false });

router.get('/', protect, stockController.getAllStocks);

router.get('/:stockId', protect, stockController.getStockById);

module.exports = router;