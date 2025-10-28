const express = require('express');
const router = express.Router();
const passport = require('passport');
const holdingController = require('../Controllers/holdingController.js');

const protect = passport.authenticate('jwt', { session: false });

router.get("/", protect, holdingController.getAllHoldings);
router.post("/update", protect, holdingController.updateHolding);
router.post("/quantity", protect, holdingController.getAvailableQty);

module.exports = router;