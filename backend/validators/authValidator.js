const { body, validationResult } = require('express-validator');

const registerRules = [
  body('username')
    .exists().withMessage('username is required')
    .bail()
    .isString().withMessage('username must be a string')
    .bail()
    .trim().notEmpty().withMessage('username cannot be empty'),
  body('email')
    .exists().withMessage('email is required')
    .bail()
    .isEmail().withMessage('must be a valid email').normalizeEmail(),
  body('password')
    .exists().withMessage('password is required')
    .bail()
    .isLength({ min: 6 }).withMessage('password must be at least 6 characters')
];

const loginRules = [
  body('username')
    .exists().withMessage('username is required'),
  body('password')
    .exists().withMessage('password is required')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const payload = errors.array().map(e => ({ param: e.param, msg: e.msg }));
    return res.status(422).json({ success: false, errors: payload });
  }
  return next();
};

module.exports = { registerRules, loginRules, validate };
