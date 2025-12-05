// validators/orderValidator.js
const { body, validationResult } = require('express-validator');

const buySellRules = [
  body('stockName')
    .exists().withMessage('stockName is required')
    .bail()
    .isString().withMessage('stockName must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('stockName cannot be empty'),

  body('qty')
    .exists().withMessage('qty is required')
    .bail()
    .custom((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }).withMessage('qty must be a positive number'),

  body('AveragePrice')
    .exists().withMessage('AveragePrice is required')
    .bail()
    .custom((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }).withMessage('AveragePrice must be a positive number')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const payload = errors.array().map(e => ({ param: e.param, msg: e.msg }));
    return res.status(422).json({ success: false, errors: payload });
  }
  return next();
};

module.exports = { buySellRules, validate };
