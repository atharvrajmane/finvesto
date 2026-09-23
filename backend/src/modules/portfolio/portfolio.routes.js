const express = require("express");
const passport = require("passport");
const portfolioController = require("./portfolio.controller");

const router = express.Router();
const protect = passport.authenticate("jwt", { session: false });

router.get("/", protect, portfolioController.getPortfolio);
router.get(
  "/:stockId/quantity",
  protect,
  portfolioController.getHoldingQuantity
);

module.exports = router;
