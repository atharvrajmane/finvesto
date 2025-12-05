const express = require("express");
const router = express.Router();
const passport = require("passport");
const orderController = require("../Controllers/orderController.js");

const {
  buySellRules,
  validate: validateOrder,
} = require("../validators/orderValidator");

const protect = passport.authenticate("jwt", { session: false });

router.get("/", protect, orderController.getAllOrders);
router.post(
  "/buy",
  protect,
  buySellRules,
  validateOrder,
  orderController.placeBuyOrder
);
router.post(
  "/sell",
  protect,
  buySellRules,
  validateOrder,
  orderController.placeSellOrder
);

module.exports = router;
