const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

// Shield 1: The Auth Limiter (IP-Based)
// This is used for login and registration where the user doesn't have an ID yet.
// It limits requests per IP address to prevent brute-force and DDoS on auth routes.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many auth requests from this IP, please try again after 15 minutes', 429));
  }
});

// Shield 2: The API Limiter (User-Based)
// This is used for authenticated routes (trading, portfolio, etc.).
// It completely ignores the IP address and uses the User ID instead.
// This allows 100 people on the same Wi-Fi to trade without affecting each other.
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Limit each User ID to 200 requests per minute
  standardHeaders: true, 
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, trustProxy: false },
  keyGenerator: (req, res) => {
    // If user is authenticated, use their ID as the key.
    // If not authenticated (shouldn't happen on protected routes), fallback to IP.
    if (req.user && req.user._id) {
        return req.user._id.toString();
    }
    // express-rate-limit throws an error if we return req.ip exactly or modified slightly
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
