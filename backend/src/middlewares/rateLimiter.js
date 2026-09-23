const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  standardHeaders: true, 
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many auth requests from this IP, please try again after 15 minutes', 429));
  }
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 200, 
  standardHeaders: true, 
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, trustProxy: false },
  keyGenerator: (req, res) => {
    if (req.user && req.user._id) {
        return req.user._id.toString();
    }
    return "anonymous";
  },
  handler: (req, res, next) => {
    next(new AppError('API rate limit exceeded for your account. Please slow down.', 429));
  }
});

module.exports = {
  authLimiter,
  apiLimiter
};
