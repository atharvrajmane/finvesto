const cron = require('node-cron');
const axios = require('axios');
const redisClient = require('../config/redis');
const { StockModel } = require('../models/StockModel'); 

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRK.B', 
  'JPM', 'JNJ', 'V', 'UNH', 'HD', 'PG', 'MA', 'DIS', 'PYPL', 'BAC', 
  'VZ', 'ADBE', 'CMCSA', 'NFLX', 'KO', 'NKE', 'MRK', 'PEP', 'T', 
  'PFE', 'INTC', 'CRM', 'ABT', 'ORCL', 'ABBV', 'CSCO', 'TMO', 'AVGO', 
  'XOM', 'ACN', 'QCOM', 'COST', 'CVX', 'LLY', 'MCD', 'DHR', 'MDT', 
  'NEE', 'TXN', 'HON'
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let isWorkerRunning = false; 

cron.schedule('* * * * *', async () => {
  if (isWorkerRunning) {
    console.warn('[CRON] Previous market data job is still running. Skipping this cycle.');
    return;
  }

  isWorkerRunning = true;

  try {
    console.log(`[CRON] Starting market data refresh for ${SYMBOLS.length} stocks...`);
    let successCount = 0;
    const startTime = Date.now();
    const backgroundTasks = [];

    for (const symbol of SYMBOLS) {
      const fetchAndSaveTask = (async () => {
        try {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
            { timeout: 10000 } 
          );

          const currentPrice = response.data.c;

          if (currentPrice && currentPrice > 0) {
            const redisKey = `stock:${symbol}:price`;
            await redisClient.set(redisKey, currentPrice, 'EX', 60);

            await StockModel.findOneAndUpdate(
              { symbol: symbol },
              { price: currentPrice, lastPriceUpdatedAt: new Date() },
              { new: true, upsert: true }
            );
            successCount++;
          }
        } catch (error) {
          console.error(`[CRON] Failed for ${symbol}:`, error.message);
        }
      })();

      backgroundTasks.push(fetchAndSaveTask);
      await sleep(150);
    }

    for (const indexSymbol of ['NIFTY', 'SENSEX']) {
      const simTask = (async () => {
        const doc = await StockModel.findOne({ symbol: indexSymbol });
        if (doc) {
          const volatility = indexSymbol === 'NIFTY' ? 50 : 150;
          const change = (Math.random() * (volatility * 2)) - volatility;
          const newPrice = Math.max(1, doc.price + change);

                    await redisClient.set(`stock:${indexSymbol}:price`, newPrice, 'EX', 60);
          await StockModel.updateOne(
            { symbol: indexSymbol }, 
            { price: newPrice, lastPriceUpdatedAt: new Date() }
          );
        }
      })();
      backgroundTasks.push(simTask);
    }

    await Promise.all(backgroundTasks);

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[CRON] Successfully updated ${successCount}/${SYMBOLS.length} stocks in ${timeTaken} seconds.`);

  } catch (error) {
    console.error('[CRON] Fatal error in worker:', error.message);
  } finally {
    isWorkerRunning = false;
  }
});

console.log('Market Data Worker initialized with Self-Healing Mutex Lock...');