const express = require("express");
const router = express.Router();
const passport = require("passport");
const fundController = require("../Controllers/fundController.js");

const {
  addFundsRules,
  validate: validateFunds,
} = require("../validators/fundsValidator");

const protect = passport.authenticate("jwt", { session: false });

router.get("/", protect, fundController.getFunds);
router.post(
  "/add",
  protect,
  addFundsRules,
  validateFunds,
  fundController.addFunds
);

module.exports = router;
