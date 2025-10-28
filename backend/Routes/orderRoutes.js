const express = require('express');
const router = express.Router();
const passport = require('passport');
const orderController = require('../Controllers/orderController.js');

const protect = passport.authenticate('jwt', { session: false });

router.get("/", protect, orderController.getAllOrders);
router.post("/buy", protect, orderController.placeBuyOrder);
router.post("/sell", protect, orderController.placeSellOrder);

module.exports = router;