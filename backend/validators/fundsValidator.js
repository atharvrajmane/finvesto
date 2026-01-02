const { body, validationResult } = require('express-validator');

const addFundsRules = [
  body('amount')
    .exists().withMessage('amount is required')
    .bail()
    .custom((v) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0;
    }).withMessage('amount must be a positive number')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const payload = errors.array().map(e => ({ param: e.param, msg: e.msg }));
    return res.status(422).json({ success: false, errors: payload });
  }
  return next();
};

module.exports = { addFundsRules, validate };
