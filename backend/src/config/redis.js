const Redis = require('ioredis');
const AppError = require('../utils/AppError');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = new Redis(redisUrl, {
  retryStrategy: (times) => {
    console.warn(`Retrying Redis connection (Attempt ${times})...`);
    return Math.min(times * 50, 3000); 
  },
});

redisClient.on('connect', () => {
  console.log('Redis cache securely connected');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

module.exports = redisClient;