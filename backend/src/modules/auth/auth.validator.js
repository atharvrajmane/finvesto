const { body, validationResult } = require("express-validator");
const AppError = require("../../utils/AppError");

const registerRules = [
  body("username")
    .exists()
    .withMessage("username is required")
    .bail()
    .isString()
    .withMessage("username must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("username cannot be empty")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("username must be between 3 and 20 characters"),
  body("email")
    .exists()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("must be a valid email")
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
];

const loginRules = [
  body("username").exists().withMessage("username is required"),
  body("password").exists().withMessage("password is required"),
];

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors
      .array()
      .map((e) => ({ field: e.path, message: e.msg }));
    return next(
      new AppError("Validation Failed", 422, { errors: formattedErrors })
    );
  }
  return next();
};

module.exports = { registerRules, loginRules, validate };
