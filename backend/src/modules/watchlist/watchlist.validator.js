const { body, param, validationResult } = require("express-validator");
const AppError = require("../../utils/AppError");

const addWatchlistRules = [
  body("stockId")
    .exists()
    .withMessage("stockId is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid stock format"),
];

const removeWatchlistRules = [
  param("stockId")
    .exists()
    .withMessage("stockId is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid stock format"),
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

module.exports = { addWatchlistRules, removeWatchlistRules, validate };
