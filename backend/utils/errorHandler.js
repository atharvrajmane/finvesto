// utils/errorHandler.js
const AppError = require('./AppError');

function formatError(err) {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  const payload = {
    success: false,
    message,
  };

  // include additional info for operational errors
  if (err.isOperational && err.extra) payload.extra = err.extra;

  // include stack only in non-production for debugging
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
    if (!err.isOperational) payload.raw = { name: err.name, message: err.message };
  }
  return { status, payload };
}

module.exports = function errorHandler(err, req, res, next) {
  // If not instance of AppError, log it and convert to AppError (programming error)
  console.error('Unhandled error:', err);

  // If it's a Mongoose validation error, normalize it
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    const appErr = new AppError(messages.join('; '), 422, { mongoose: true });
    const { status, payload } = formatError(appErr);
    return res.status(status).json(payload);
  }

  // If it's an express-validator error shape forwarded, respect status 422
  if (err.statusCode === 422 && err.errors) {
    const appErr = new AppError(err.message || 'Validation failed', 422, { errors: err.errors });
    const { status, payload } = formatError(appErr);
    return res.status(status).json(payload);
  }

  // Otherwise, convert unknown errors into AppError if necessary
  const appErr = err.isOperational ? err : new AppError(err.message || 'Internal Server Error', err.statusCode || 500);
  const { status, payload } = formatError(appErr);
  return res.status(status).json(payload);
};
