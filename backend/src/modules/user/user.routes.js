const express = require("express");
const passport = require("passport");
const userController = require("./user.controller");

const { addBalanceRules, validate } = require("./user.validator");

const router = express.Router();
const protect = passport.authenticate("jwt", { session: false });

router.get("/balance", protect, userController.getBalance);

router.post(
  "/balance/add",
  protect,
  addBalanceRules,
  validate,
  userController.addBalance
);

module.exports = router;
