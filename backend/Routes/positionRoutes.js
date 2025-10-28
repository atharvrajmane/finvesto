const express = require('express');
const router = express.Router();
const passport = require('passport');
const positionController = require('../Controllers/positionController.js');

const protect = passport.authenticate('jwt', { session: false });

router.get("/", protect, positionController.getAllPositions);

module.exports = router;