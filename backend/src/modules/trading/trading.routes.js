const express = require("express");
const passport = require("passport");
const tradingController = require("./trading.controller");
const { buySellRules, validate } = require("./trading.validator");

const router = express.Router();
const protect = passport.authenticate("jwt", { session: false });
const idempotency = require("../../middlewares/idempotency.js");

router.get("/", protect, tradingController.getAllOrders);

router.post(
  "/buy",
  protect,
  idempotency,
  buySellRules,
  validate,
  tradingController.placeBuyOrder
);

router.post(
  "/sell",
  protect,
  idempotency,
  buySellRules,
  validate,
  tradingController.placeSellOrder
);

module.exports = router;
