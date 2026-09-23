const AppError = require('./AppError');

function formatError(err) {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  const payload = {
    success: false,
    message,
  };

  if (err.isOperational && err.extra) payload.extra = err.extra;

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
    if (!err.isOperational) payload.raw = { name: err.name, message: err.message };
  }
  return { status, payload };
}

module.exports = function errorHandler(err, req, res, next) {
  console.error("API Error:", err.message, err.stack);

  // 1.Validation Error handler
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    const appErr = new AppError(messages.join('; '), 422, { mongoose: true });
    const { status, payload } = formatError(appErr);
    return res.status(status).json(payload);
  }

  // 2. Mongoose bad ObjectId format (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}.`;
    const appErr = new AppError(message, 400);
    const { status, payload } = formatError(appErr);
    return res.status(status).json(payload);
  }

  // 3. MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate field value: '${value}'. Please use another value!`;
    const appErr = new AppError(message, 400);
    const { status, payload } = formatError(appErr);
    return res.status(status).json(payload);
  }

  // 4.Custom 422 handler
  if (err.statusCode === 422 && err.errors) {
    const appErr = new AppError(err.message || 'Validation failed', 422, { errors: err.errors });
    const { status, payload } = formatError(appErr);
    return res.status(status).json(payload);
  }

  // 5.Ultimate fallback
  const appErr = err.isOperational ? err : new AppError(err.message || 'Internal Server Error', err.statusCode || 500);
  const { status, payload } = formatError(appErr);
  return res.status(status).json(payload);
};