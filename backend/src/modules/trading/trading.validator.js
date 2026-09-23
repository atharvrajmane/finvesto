const { body, validationResult } = require("express-validator");
const AppError = require('../../utils/AppError');

const buySellRules = [
  body("stockId")
    .exists()
    .withMessage("stockId is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid stock format"),
  body("quantity")
    .exists()
    .withMessage("quantity is required")
    .bail()
    .isInt({ min: 1, max: 10000 })
    .withMessage("Retail orders cannot exceed 10,000 shares per transaction"),
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

module.exports = { buySellRules, validate };