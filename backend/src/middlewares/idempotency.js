const redisClient = require('../config/redis');
const AppError = require('../utils/AppError');

const idempotency = async (req, res, next) => {
  const key = req.headers['idempotency-key'];

  if (!key) {
    return next(new AppError('Idempotency-Key header is required for this transaction', 400));
  }

  try {
    const userId = req.user && req.user._id ? req.user._id.toString() : 'anonymous';
    const redisKey = `idempotency:${userId}:${key}`;

    const lockAcquired = await redisClient.set(redisKey, 'IN-PROGRESS', 'NX', 'EX', 30);

    if (!lockAcquired) {
      const cachedResponse = await redisClient.get(redisKey);

            if (cachedResponse === 'IN-PROGRESS') {
        return res.status(409).json({
          success: false,
          message: 'Duplicate request is currently processing. Please wait.'
        });
      } else if (cachedResponse) {
        console.log(`Duplicate request safely caught for key: ${key}`);
        const parsedResponse = JSON.parse(cachedResponse);
        return res.status(200).json(parsedResponse);
      }
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redisClient.set(redisKey, JSON.stringify(body), 'EX', 300)
          .catch(err => console.error('Redis Idempotency Save Error:', err));
      } else {
        redisClient.del(redisKey).catch(err => console.error('Redis Idempotency Delete Error:', err));
      }

      return originalJson(body);
    };

    next();
  } catch (error) {
    next(new AppError('Idempotency system failure', 500));
  }
};

module.exports = idempotency;