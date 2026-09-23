const express = require("express");
const authController = require("./auth.controller");
const { registerRules, loginRules, validate } = require("./auth.validator");

const { authLimiter } = require("../../middlewares/rateLimiter");

const router = express.Router();

const passport = require("passport");

router.post("/register", authLimiter, registerRules, validate, authController.register);
router.post("/login", authLimiter, loginRules, validate, authController.login);
router.post("/refresh", authLimiter, authController.refresh);
router.post("/logout", passport.authenticate('jwt', { session: false }), authController.logout);
router.get("/me", passport.authenticate('jwt', { session: false }), authController.me);

module.exports = router;
