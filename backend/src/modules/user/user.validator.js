const { body, validationResult } = require("express-validator");
const AppError = require("../../utils/AppError");

const addBalanceRules = [
  body("amount")
    .exists()
    .withMessage("amount is required")
    .bail()
    .custom((v) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0;
    })
    .withMessage("amount must be a positive number"),
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

module.exports = { addBalanceRules, validate };
