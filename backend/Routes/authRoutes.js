const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

const {
  registerRules,
  loginRules,
  validate: validateAuth,
} = require("../validators/authValidator");

router.post("/register", registerRules, validateAuth, authController.register);
router.post("/login", loginRules, validateAuth, authController.login);

module.exports = router;
