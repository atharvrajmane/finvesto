const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const RedisMock = require('ioredis-mock');

let mongoServer;

// Mock the Redis client globally so our app uses ioredis-mock during tests
jest.mock('../src/config/redis', () => {
  const RedisMock = require('ioredis-mock');
  return new RedisMock();
});

jest.mock('express-rate-limit', () => () => (req, res, next) => next());

// Set JWT secret globally before any app modules are required
process.env.JWT_SECRET = 'test_secret_key';

// Increase Jest timeout globally to allow MongoMemoryReplSet time to download and boot
jest.setTimeout(60000);

// Force mongodb-memory-server to use MongoDB 6.0.4 to prevent internal driver handshake errors with v7+
process.env.MONGOMS_VERSION = '6.0.4';

beforeAll(async () => {
  // Use the cloud Replica Set, but point it to a dedicated _test database
  const uri = 'mongodb+srv://finvestoAdmin:Gc76YlRE1XJYEeyQ@finvesto-v2-dev.2utyk6q.mongodb.net/finvesto_test';

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  // Clear all collections after each test to ensure hermetic state
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
