const request = require('supertest');
const app = require('../../src/app');
const { UserModel } = require('../../src/models/UserModel');
const { StockModel } = require('../../src/models/StockModel');
const authService = require('../../src/modules/auth/auth.service');
const { HoldingsModel } = require('../../src/models/HoldingsModel');

describe('Trading API Integration Tests', () => {
  let userAccessToken;
  let testUser;
  let testStock;

  beforeEach(async () => {
    // 1. Create a Test User
    const registerResponse = await authService.register({
      username: 'testtrader',
      email: 'trader@test.com',
      password: 'password123'
    });
    userAccessToken = registerResponse.accessToken;
    testUser = registerResponse.user;

    // 2. Create a Test Stock
    testStock = await StockModel.create({
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.00,
      lastPriceUpdatedAt: new Date()
    });
  });

  describe('POST /api/trading/buy', () => {
    
    it('should execute a valid buy order and deduct balance', async () => {
      const quantity = 10;
      const expectedCost = 10 * 150.00; // 1500

      const response = await request(app)
        .post('/api/trading/buy')
        .set('Cookie', [`accessToken=${userAccessToken}`])
        .set('Idempotency-Key', 'unique-key-1')
        .send({ stockId: testStock._id.toString(), quantity });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      // Verify User Balance Deducted
      const updatedUser = await UserModel.findById(testUser.id);
      expect(updatedUser.balance).toBe(100000 - expectedCost);

      // Verify Portfolio Created
      const holding = await HoldingsModel.findOne({ userId: testUser.id, stockId: testStock._id });
      expect(holding).toBeTruthy();
      expect(holding.quantity).toBe(10);
      expect(holding.averageBuyPrice).toBe(150.00);
    });

    it('should reject a buy order if the user has insufficient funds', async () => {
      const quantity = 1000; // 1000 * 150 = 150,000 (User only has 100,000)

      const response = await request(app)
        .post('/api/trading/buy')
        .set('Cookie', [`accessToken=${userAccessToken}`])
        .set('Idempotency-Key', 'unique-key-2')
        .send({ stockId: testStock._id.toString(), quantity });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient balance');

      // Verify Balance NOT Deducted
      const updatedUser = await UserModel.findById(testUser.id);
      expect(updatedUser.balance).toBe(100000);
      
      // Verify Portfolio NOT Created
      const holding = await HoldingsModel.findOne({ userId: testUser.id, stockId: testStock._id });
      expect(holding).toBeNull();
    });

    it('should block double-spending when the exact same idempotency key is used', async () => {
      const quantity = 10;
      const idempotencyKey = 'double-click-key';

      // Send two requests almost simultaneously
      const req1 = request(app)
        .post('/api/trading/buy')
        .set('Cookie', [`accessToken=${userAccessToken}`])
        .set('Idempotency-Key', idempotencyKey)
        .send({ stockId: testStock._id.toString(), quantity });

      const req2 = request(app)
        .post('/api/trading/buy')
        .set('Cookie', [`accessToken=${userAccessToken}`])
        .set('Idempotency-Key', idempotencyKey)
        .send({ stockId: testStock._id.toString(), quantity });

      const [res1, res2] = await Promise.all([req1, req2]);

      // One should succeed (201), the other should hit the Redis lock and return 409
      const statuses = [res1.status, res2.status];
      expect(statuses).toContain(201);
      expect(statuses).toContain(409);

      // Verify user was only charged ONCE (100,000 - 1,500 = 98,500)
      const updatedUser = await UserModel.findById(testUser.id);
      expect(updatedUser.balance).toBe(98500);

      // Verify only 10 shares were bought, not 20
      const holding = await HoldingsModel.findOne({ userId: testUser.id, stockId: testStock._id });
      expect(holding.quantity).toBe(10);
    });

  });
});
