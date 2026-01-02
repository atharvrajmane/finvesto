// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode = 500, extra = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.extra = extra;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
