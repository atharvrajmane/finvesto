const stockRepository = require("./stock.repository");
const AppError = require("../../utils/AppError");
const redisClient = require("../../config/redis");

class StockService {
  async getAllStocks() {
    const cachedStocks = await redisClient.get("stocks:all");
    let stocks;

    if (cachedStocks) {
      stocks = JSON.parse(cachedStocks);
    } else {
      stocks = await stockRepository.getAllStocks();
      await redisClient.set("stocks:all", JSON.stringify(stocks), "EX", 3600);
    }

    const pipeline = redisClient.pipeline();
    for (const stock of stocks) {
      pipeline.get(`stock:${stock.symbol}:price`);
    }
    const livePrices = await pipeline.exec();

    stocks = stocks.map((stock, index) => {
      const livePrice = livePrices[index][1];
      if (livePrice) {
        stock.price = parseFloat(livePrice);
        stock.lastPriceUpdatedAt = new Date();
      }
      return stock;
    });

    return stocks;
  }

  async getStockById(stockId) {
    const cacheKey = `stock:doc:${stockId}`;
    const cachedStock = await redisClient.get(cacheKey);
    let stock;

    if (cachedStock) {
      stock = JSON.parse(cachedStock);
    } else {
      stock = await stockRepository.getStockById(stockId);
      if (!stock) {
        throw new AppError("Stock not found", 404);
      }
      await redisClient.set(cacheKey, JSON.stringify(stock), "EX", 3600);
    }

    const livePrice = await redisClient.get(`stock:${stock.symbol}:price`);
    if (livePrice) {
      stock.price = parseFloat(livePrice);
      stock.lastPriceUpdatedAt = new Date();
    }

    return stock;
  }
}

module.exports = new StockService();
